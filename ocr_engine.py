import sys
import logging
import os

os.environ['GLOG_minloglevel'] = '3'
logging.getLogger("ppocr").setLevel(logging.ERROR)

try:
    from paddleocr import PaddleOCR
    
    def run_ocr(image_path):
        # On garde l'anglais car Tefal est en alphabet latin
        ocr = PaddleOCR(use_angle_cls=True, lang='en')
        result = ocr.ocr(image_path, cls=True)
        
        detected_texts = []
        if result and result[0]:
            for line in result[0]:
                text = line[1][0]
                confidence = line[1][1]
                # CORRECTION : Seuil abaissé à 0.4 pour capter les polices bizarres
                if confidence > 0.4:
                    detected_texts.append(text)
        
        print(" ".join(detected_texts))

    if __name__ == "__main__":
        if len(sys.argv) > 1:
            run_ocr(sys.argv[1])
            
except Exception:
    pass

sys.exit(0)
