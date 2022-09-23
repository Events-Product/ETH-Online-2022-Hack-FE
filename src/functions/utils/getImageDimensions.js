const imageDimensions = (file) => {
  const img = new Image();
  const promise = new Promise((resolve, reject) => {
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      resolve({ width, height });
    };
    img.onerror = reject;
  });
  img.src = URL.createObjectURL(file);

  return promise;
};

export default imageDimensions;
