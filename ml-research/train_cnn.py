import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
import json
import os

print("Downloading and preparing MNIST...")
# Add data augmentation
transform = transforms.Compose([
    transforms.RandomAffine(degrees=15, translate=(0.1, 0.1), scale=(0.8, 1.2)),
    transforms.ToTensor(), 
    transforms.Normalize((0.1307,), (0.3081,))
])

train_dataset = datasets.MNIST('./data', train=True, download=True, transform=transform)
train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=128, shuffle=True)

class TinyCNN(nn.Module):
    def __init__(self):
        super(TinyCNN, self).__init__()
        # Input 1x28x28 -> Output 8x28x28
        self.conv1 = nn.Conv2d(1, 8, kernel_size=3, padding=1)
        # Maxpool 2x2 -> Output 8x14x14
        self.pool = nn.MaxPool2d(2, 2)
        # Flatten -> 8 * 14 * 14 = 1568
        self.fc1 = nn.Linear(8 * 14 * 14, 10)

    def forward(self, x):
        # x is [B, 1, 28, 28]
        x = torch.relu(self.conv1(x))
        x = self.pool(x)
        x = x.view(-1, 8 * 14 * 14)
        x = self.fc1(x)
        return x

model = TinyCNN()
optimizer = optim.Adam(model.parameters(), lr=0.002)
criterion = nn.CrossEntropyLoss()

print("Training Tiny CNN for 3 epochs...")
model.train()
for epoch in range(3):
    for batch_idx, (data, target) in enumerate(train_loader):
        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()
    print(f"Epoch {epoch+1}/3 Loss: {loss.item():.4f}")

print("Exporting weights to JSON...")
# We need to flatten the conv weights for easy JS access
weights = {
    "conv_weight": model.conv1.weight.detach().numpy().tolist(), # shape [8, 1, 3, 3]
    "conv_bias": model.conv1.bias.detach().numpy().tolist(),     # shape [8]
    "fc_weight": model.fc1.weight.detach().numpy().tolist(),     # shape [10, 1568]
    "fc_bias": model.fc1.bias.detach().numpy().tolist(),         # shape [10]
}

os.makedirs("src/assets", exist_ok=True)
with open("src/assets/cnn_weights.json", "w") as f:
    json.dump(weights, f)

print("Saved weights to src/assets/cnn_weights.json")
