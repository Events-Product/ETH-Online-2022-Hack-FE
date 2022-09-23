export const SUPPORTED_FORMATS = {
  image: ["image/jpeg", "image/png", "image/svg+xml", "image/gif"],
  audio: ["audio/mpeg", "audio/wav"],
  video: ["video/mp4"],
  gl: ["gltf", "glb"],
  obj: ["obj"],
};

export const getTypeOfMedia = (file, formats = SUPPORTED_FORMATS) => {
  const typeFile = file.type;

  if (typeFile === "") {
    // if (isSupportedGLFormat(file)) {
    //   return "gl";
    // }

    // if (isSupportedObjFormat(file)) {
    //   return "obj";
    // }

    return null;
  }

  const formatValue = Object.entries(formats).filter(([, values]) => {
    return values.includes(typeFile);
  })[0];

  return formatValue.length ? formatValue[0] : null;
};
