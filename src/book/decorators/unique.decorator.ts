import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";

export function IsUnique(property, validationOptions?: ValidationOptions) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: "IsUnique",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: Unique
    });
  };
}

@ValidatorConstraint({ name: "IsUnique" })
export class Unique implements ValidatorConstraintInterface {
  validate(values: any[], args: ValidationArguments) {
    const [property] = args.constraints;
    const set = new Set();
    values.forEach((value) => {
      set.add(value[property]);
    });
    return set.size === values.length;
  }

  defaultMessage(args: ValidationArguments) {
    const [property] = args.constraints;
    return `${property} არ უნდა მეორდებოდეს`;
  }
}
