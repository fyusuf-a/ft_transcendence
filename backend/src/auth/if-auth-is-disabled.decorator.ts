import { SetMetadata } from '@nestjs/common';

export const IF_AUTH_IS_DISABLED = 'ifAuthIsDisabled';
export const IfAuthIsDisabled = () => SetMetadata(IF_AUTH_IS_DISABLED, true);
