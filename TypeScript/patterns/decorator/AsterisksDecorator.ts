function AddAsterisks(
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    let originalMethod = descriptor.value;
    descriptor.value = function (msg: string) {
      return originalMethod.call(this, `****** ${msg} ******`);
    };
  }