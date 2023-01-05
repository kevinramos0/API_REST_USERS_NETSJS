import {
  registerDecorator,
  ValidationOptions,
  //   ValidationArguments,
} from 'class-validator';

export function TransformBoolean(
  property: string,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'TransformBoolean',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return typeof value === 'string' && value === 'true'; // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}
