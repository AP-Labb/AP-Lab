import math
import random
from PIL import Image

def create_pixel_icon_pattern():
    # Tile size 256x256
    width, height = 256, 256
    img = Image.new("RGBA", (width, height), (9, 11, 22, 255))
    
    # Small pixelated </> developer symbol matrix (8x8)
    # '<' on left, '/' in middle, '>' on right
    symbol_pixels = [
        # '<'
        (3, 1), (2, 2), (1, 3), (2, 4), (3, 5),
        # '/'
        (5, 1), (4, 3), (3, 5),
        # '>'
        (5, 2), (6, 3), (5, 4)
    ]
    
    scale = 3  # Each pixel is 3x3 px
    cols, rows = 4, 4
    spacing_x = width // cols
    spacing_y = height // rows
    
    for r in range(rows):
        for c in range(cols):
            start_x = c * spacing_x + 14
            start_y = r * spacing_y + 14
            
            for (px_x, px_y) in symbol_pixels:
                for bx in range(scale):
                    for by in range(scale):
                        ix = (start_x + px_x * scale + bx) % width
                        iy = (start_y + px_y * scale + by) % height
                        noise = random.uniform(0.8, 1.0)
                        red = int((0.1 * noise) * 255)
                        green = int((0.82 * noise) * 255)
                        blue = int((0.96 * noise) * 255)
                        alpha = int(random.uniform(0.8, 1.0) * 255)
                        img.putpixel((ix, iy), (red, green, blue, alpha))

    img.save("/Users/pallavipatil/AP-LABs/AP-Lab/public/images/iconpattern.png", "PNG")
    print("Saved public/images/iconpattern.png with small </> developer icons successfully!")

if __name__ == "__main__":
    create_pixel_icon_pattern()
