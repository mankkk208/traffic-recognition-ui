import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  margin-bottom: 20px;
  color: #333;
`;

const UploadSection = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  border: 2px dashed #ccc;
  border-radius: 5px;
`;

const ImagePreview = styled.div`
  margin-top: 10px;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  margin: 5px;
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;
  font-size: 16px;

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultSection = styled.div`
  margin-top: 20px;
`;

const ResultTextarea = styled.textarea`
  width: 100%;
  margin-top: 20px;
  font-size: 16px;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  min-height: 100px;
  resize: vertical;
`;

const FileInput = styled.input`
  display: block;
  margin: 0 auto;
  padding: 10px;
`;

function App() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [bboxImageUrl, setBboxImageUrl] = useState<string>(''); // Image with bbox
  const [result, setResult] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const BaseURL = 'https://traffic-sign-recognition-backend-681792955708.us-central1.run.app';
  //const BaseURL = 'http://localhost:8000';

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
        setBboxImageUrl(''); // Reset bbox image on new upload
      };
      reader.readAsDataURL(file);
    }
  };

  const callPredictionAPI = async (endpoint: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setResult("Đang xử lý...");

    try {
      const response = await fetch(`${BaseURL}${endpoint}`, {
        method: "POST",
        body: formData,
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          detail: `HTTP error! status: ${response.status}`
        }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(`Lỗi khi gọi API: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handlePrediction = async (endpoint: string) => {
    if (!uploadedImage) {
      alert("Vui lòng chọn ảnh trước!");
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const result = await callPredictionAPI(endpoint, uploadedImage);
      setResult(result.prediction || result.predicted_sign || "Không nhận diện được biển báo.");

      if (result.image_base64) {
        setBboxImageUrl(`data:image/jpeg;base64,${result.image_base64}`);
      }
    } catch (error) {
      console.error("Prediction Error:", error);
      setResult(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container>
      <Title>Traffic Sign Recognition</Title>

      <form onSubmit={(e) => e.preventDefault()}>
        <UploadSection>
          <FileInput
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
          />
          <ImagePreview>
            {bboxImageUrl ? (
              <img src={bboxImageUrl} alt="Detected with bbox" />
            ) : previewUrl && (
              <img src={previewUrl} alt="Preview" />
            )}
          </ImagePreview>
        </UploadSection>

        <ButtonSection>
          <Button
            type="button"
            onClick={() => handlePrediction("/yolo/predict/")}
            disabled={isProcessing}
          >
            Check YOLO
          </Button>
          <Button
            type="button"
            onClick={() => handlePrediction("/gemini/predict/")}
            disabled={isProcessing}
          >
            Check Gemini
          </Button>
          <Button
            type="button"
            onClick={() => handlePrediction("/gpt/predict/")}
            disabled={isProcessing}
          >
            Check GPT
          </Button>
        </ButtonSection>

        <ResultSection>
          <ResultTextarea
            value={result}
            readOnly
            rows={5}
            placeholder="Kết quả sẽ hiển thị ở đây..."
          />
        </ResultSection>
      </form>
    </Container>
  );
}

export default App;