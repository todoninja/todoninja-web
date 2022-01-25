import { OpaqueAttributes, OpaqueRowInterface } from "@opaquejs/opaque/lib/contracts/ModelContracts";
import { watch, reactive, markRaw, isReactive } from "vue";

export let noReactivity: boolean = false;

export const vueModel = <
  T extends (new (...args: any[]) => OpaqueRowInterface) & {
    $deserialize: (data: OpaqueAttributes) => OpaqueAttributes;
  }
>(
  base: T
) =>
  class VueReactiveModel extends base {
    public static $deserialized: Map<OpaqueAttributes, OpaqueAttributes> = new Map();

    constructor(...args: any[]) {
      super();
      this.$ensureReactivity();
      markRaw(this);
    }

    static $deserialize(data: OpaqueAttributes) {
      if (!isReactive(data)) {
        return super.$deserialize(data);
      }
      if (!this.$deserialized.has(data)) {
        this.$deserialized.set(data, reactive({}));
        watch(
          data,
          value => {
            Object.assign(this.$deserialized.get(data), super.$deserialize(value));
          },
          { immediate: true }
        );
      }
      return this.$deserialized.get(data)!;
    }

    static $fromRow<Model extends new () => VueReactiveModel>(
      this: Model,
      data: OpaqueAttributes,
      options: any
    ): InstanceType<Model> {
      noReactivity = true;
      // @ts-ignore
      const ret = super.$fromRow(data, options);
      noReactivity = false;
      ret.$ensureReactivity();
      return ret;
    }

    $ensureReactivity(): this {
      if (!noReactivity) {
        this.$attributes.chain = reactive(this.$attributes.chain);
      }
      return this;
    }
  };
