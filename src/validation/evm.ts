
const EVM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export const isEvmValidation = (address: string): boolean => {
    // Trim the address to remove any leading/trailing whitespace
    const trimmedAddress = address.trim();

    // Check if the address matches the regex pattern
    if (!EVM_ADDRESS_REGEX.test(trimmedAddress)) {
        return false;
    }

    // Optional: Add checksum validation for mixed-case addresses
    if (/[A-F]/.test(trimmedAddress)) {
        return isChecksumAddress(trimmedAddress);
    }

    return true;
};

function isChecksumAddress(address: string): boolean {
    address = address.replace('0x', '');
    const addressHash = keccak256(address.toLowerCase());

    for (let i = 0; i < 40; i++) {
        if (
            (parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
            (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])
        ) {
            return false;
        }
    }
    return true;
}

function keccak256(input: string): string {
    // This is a placeholder. In a real implementation, use a proper Keccak-256 function
    return input; // Placeholder return
}
