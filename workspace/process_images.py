from PIL import Image
import os

def remove_bg(img_path, tolerance=30):
    try:
        img = Image.open(img_path)
        img = img.convert("RGBA")
        datas = img.getdata()
        
        newData = []
        # Get background color from top-left pixel
        bg_color = img.getpixel((0, 0))
        print(f"Background color detected: {bg_color}")
        
        for item in datas:
            # Check if pixel is close to background color
            if all(abs(item[i] - bg_color[i]) < tolerance for i in range(3)):
                newData.append((255, 255, 255, 0)) # Make Transparent
            else:
                newData.append(item)
        
        img.putdata(newData)
        img.save(img_path, "PNG")
        print(f"Processed {img_path}")
    except Exception as e:
        print(f"Error processing {img_path}: {e}")

def create_pwa_icons(icon_path):
    try:
        if not os.path.exists(icon_path):
            print(f"{icon_path} not found")
            return

        img = Image.open(icon_path)
        
        # 192x192
        icon192 = img.resize((192, 192), Image.Resampling.LANCZOS)
        icon192.save("public/pwa-192x192.png")
        print("Created public/pwa-192x192.png")
        
        # 512x512
        icon512 = img.resize((512, 512), Image.Resampling.LANCZOS)
        icon512.save("public/pwa-512x512.png")
        print("Created public/pwa-512x512.png")
        
    except Exception as e:
        print(f"Error creating icons: {e}")

if __name__ == "__main__":
    # Remove background from Logo
    remove_bg("public/Arqtype_logo.png", tolerance=40)
    
    # Create PWA icons from Icon
    create_pwa_icons("public/Arqtype_icon.png")
