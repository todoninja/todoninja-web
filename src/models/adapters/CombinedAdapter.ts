import { AdapterInterface, attribute, OpaqueTableInterface } from '@opaquejs/opaque'
import { OpaqueAttributes, PrimaryKeyValue } from '@opaquejs/opaque/lib/contracts/ModelContracts'
import { NormalizedQuery } from '@opaquejs/query'

export class CombinedAdapter implements AdapterInterface {
    constructor(public adapters: Map<OpaqueTableInterface, AdapterInterface>) {}
    async read(
        model: OpaqueTableInterface,
        query: NormalizedQuery<Record<string, unknown>>
    ): Promise<OpaqueAttributes[]> {
        const sources = Array.from(this.adapters.entries())
        const results = await Promise.all(
            sources.map(async ([model, adapter]) => {
                const adapterresults = await adapter.read(model, query)

                if (model.$instanceForSource === true) {
                    return adapterresults.map((attributes) => ({ attributes, __combined_source: true, model }))
                }

                return adapterresults
            })
        )
        return results.flat()
    }

    insert(model: OpaqueTableInterface, data: OpaqueAttributes): Promise<OpaqueAttributes | PrimaryKeyValue> {
        if (!this.adapters.has(model)) {
            throw new Error(
                `Combined Adapter has no adapter for model ${model.name}. Use ${Array.from(this.adapters.keys())
                    .map((model) => model.name)
                    .join(' or ')}`
            )
        }
        return this.adapters.get(model).insert(model, data)
    }
    async update(
        model: OpaqueTableInterface,
        query: NormalizedQuery<Record<string, unknown>>,
        data: OpaqueAttributes
    ): Promise<void> {
        for (const adapter of this.adapters.values()) {
            await adapter.update(model, query, data)
        }
    }
    async delete(model: OpaqueTableInterface, query: NormalizedQuery<Record<string, unknown>>): Promise<void> {
        for (const [model, adapter] of this.adapters) {
            await adapter.delete(model, query)
        }
    }
}
