import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
import json
import os

print("Downloading and preparing MNIST...")
# Add some data augmentation to make the model more robust to user drawings
transform = transforms.Compose([
    transforms.RandomAffine(degrees=15, translate=(0.1, 0.1), scale=(0.8, 1.2)),
    transforms.ToTensor(), 
    transforms.Normalize((0.1307,), (0.3081,))
])

train_dataset = datasets.MNIST('./data', train=True, download=True, transform=transform)
train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=128, shuffle=True)

class RobustMLP(nn.Module):
    def __init__(self):
        super(RobustMLP, self).__init__()
        # Wider network for better accuracy
        self.fc1 = nn.Linear(28*28, 256)
        self.fc2 = nn.Linear(256, 10)

    def forward(self, x):
        x = x.view(-1, 28*28)
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x

model = RobustMLP()
optimizer = optim.Adam(model.parameters(), lr=0.001)
criterion = nn.CrossEntropyLoss()

print("Training for 3 epochs with Data Augmentation...")
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
weights = {
    "fc1_weight": model.fc1.weight.detach().numpy().tolist(),
    "fc1_bias": model.fc1.bias.detach().numpy().tolist(),
    "fc2_weight": model.fc2.weight.detach().numpy().tolist(),
    "fc2_bias": model.fc2.bias.detach().numpy().tolist(),
}

os.makedirs("src/assets", exist_ok=True)
with open("src/assets/mnist_weights.json", "w") as f:
    json.dump(weights, f)

print("Saved weights to src/assets/mnist_weights.json")
