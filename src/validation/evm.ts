import regexParser from 'regex-parser';

export const isEvmValidation = (evm: string) => {
    const regexEvm = '/^0x[a-fA-F0-9]{40}$/gm'

    const regex = regexParser(regexEvm);
    return regex.test(evm);
};
