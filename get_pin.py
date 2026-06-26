import urllib.request
import re
import sys

url = "https://api.pinterest.com/url_shortener/40ZMcvoUP/redirect/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    match = re.search(r'<meta property="og:image" content="([^"]+)"', html)
    if match:
        img_url = match.group(1)
        print("Found image URL:", img_url)
        urllib.request.urlretrieve(img_url, "pin_image.jpg")
        print("Image downloaded to pin_image.jpg")
    else:
        print("Could not find image URL in HTML.")
except Exception as e:
    print("Error:", e)
