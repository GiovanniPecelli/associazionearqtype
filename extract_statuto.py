from pypdf import PdfReader
import sys

try:
    reader = PdfReader("STATUTO Associazione ARQtype.pdf")
    with open("statuto_raw.txt", "w", encoding="utf-8") as f:
        for page in reader.pages:
            text = page.extract_text()
            f.write(text + "\n\n")
            
    print("Done writing to statuto_raw.txt")
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
