export const buildFormData = (formData, data, parentKey) => {
  if (
    data &&
    typeof data === "object" &&
    !(data instanceof Date) &&
    !(data instanceof File)
  ) {
    Object.keys(data).forEach((key, index) => {
      const KEY = Array.isArray(data)
        ? `${parentKey}[${index}]`
        : `${parentKey}[${key}]`;

      buildFormData(formData, data[key], parentKey ? KEY : key);
    });
  } else if (parentKey) {
    if (data instanceof Date) {
      formData.append(parentKey, data.toISOString());
    } else if (data !== undefined && data !== null) {
      formData.append(parentKey, data);
    }
  }
};
