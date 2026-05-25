const italianPhoneRegex = /^(\+?39|0039)?[ ]?[3][0-9]{2}[ ]?[0-9]{3}[ ]?[0-9]{4}$/;

const validateItalianPhone = (phone: string): boolean => {
  // Remove all spaces and ensure it starts with +39
  const normalizedPhone = phone.replace(/\s/g, '').replace(/^0039/, '+39');
  return italianPhoneRegex.test(normalizedPhone);
};

export default validateItalianPhone; 