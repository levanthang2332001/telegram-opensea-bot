
const generateUUIDFromTelegramId = (telegramId: string): string => {
    const paddedId = telegramId.padStart(32, '0');
    return `${paddedId.slice(0,8)}-${paddedId.slice(8,12)}-${paddedId.slice(12,16)}-${paddedId.slice(16,20)}-${paddedId.slice(20)}`;
}

const generateIdFromUUID = (uuid: string): string => {
    return uuid.replace(/-/g, '');
}

export { generateUUIDFromTelegramId, generateIdFromUUID };



