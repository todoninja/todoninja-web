import { ref, Ref, UnwrapRef, watchEffect } from "vue";

export function asyncRef<Value>(value: (() => Promise<Value>) | Promise<Value>): Ref<UnwrapRef<Value | undefined>>;
export function asyncRef<Value>(
  value: (() => Promise<Value>) | Promise<Value>,
  defaultValue: Value
): Ref<UnwrapRef<Value>>;
export function asyncRef<Value, Default extends Value | undefined>(
  value: (() => Promise<Value>) | Promise<Value>,
  defaultValue?: Default
) {
  const model = defaultValue ? ref<Value>(defaultValue as Value) : ref<Value>();
  if (value instanceof Function) {
    watchEffect(() => value().then(m => (model.value = m)));
  } else {
    value.then(m => (model.value = m));
  }
  return model;
}
