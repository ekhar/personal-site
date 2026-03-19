import * as pulumi from '@pulumi/pulumi';

export const stack = pulumi.getStack();
export const isProduction = stack === 'production';

export const domain = 'erickhar.com';
export const blogDomain = domain;
export const dashboardDomain = `personal.${domain}`;
