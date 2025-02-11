import {describe, it, expect} from 'bun:test';
import {z} from "zod";
import * as v from 'valibot';
import {makeFunction} from "../src";
import {InvalidParametersError} from "../src/invalid-parameters.error.ts";

describe('makeFunction', () => {
  describe('zod', () => {
    const testSchema = z.object({
      name: z.string(),
      enabled: z.boolean().default(true),
    });

    it('should work with an object schema', () => {
      const testFunc = makeFunction(testSchema, (params) => {
        return `${params.name}: ${params.enabled}`;
      });

      expect(testFunc({name: 'test', enabled: true})).toEqual('test: true');
    });

    it('should work with zod defaults', () => {
      const testFunc = makeFunction(testSchema, (params) => {
        return `${params.name}: ${params.enabled}`;
      });

      expect(testFunc({name: 'test'})).toEqual('test: true');
    })

    it('should throw an error if the input is invalid', () => {
      const testFunc = makeFunction(testSchema, (params) => {
        return `${params.name}: ${params.enabled}`;
      });

      // @ts-expect-error Missing `name` field
      expect(() => testFunc({})).toThrowError(InvalidParametersError);
    });

    it('should include a message about the invalid input in the error', () => {
      const testFunc = makeFunction(testSchema, (params) => {
        return `${params.name}: ${params.enabled}`;
      });


      try {
        // @ts-expect-error Missing `name` field
        testFunc({});
        expect(true, 'should not succeed').toEqual(false); // should not reach this point
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidParametersError);
        expect((error as InvalidParametersError).message).toEqual('Invalid parameters: Required');
        expect((error as InvalidParametersError).issues).toEqual([expect.objectContaining({
          path: ['name'],
          message: 'Required'
        })]);
      }
    });

    it('should work with a non-object schema', () => {
      const testFunc = makeFunction(z.string(), (val) => val.toUpperCase());

      expect(testFunc('test')).toEqual('TEST');
    });

    it('should work with transforms', () => {
      const testFunc = makeFunction(z.string().transform(val => val.toUpperCase()), (val) => val);

      expect(testFunc('test')).toEqual('TEST');
    });

    it('should throw an error if attempting to use with an async schema', () => {
      const testFunc = makeFunction(z.string().transform(val => Promise.resolve(val)), (val) => val);

      expect(() => testFunc('test')).toThrowError('Promises are not supported in results');
    });
  });

  describe('valibot', () => {
    const testSchema = v.object({
      name: v.string(),
      enabled: v.optional(v.boolean(), true),
    });

    it('should work with an object schema', () => {
      const testFunc = makeFunction(testSchema, (params) => {
        return `${params.name}: ${params.enabled}`;
      });

      expect(testFunc({name: 'test', enabled: true})).toEqual('test: true');
    });

    it('should work with zod defaults', () => {
      const testFunc = makeFunction(testSchema, (params) => {
        return `${params.name}: ${params.enabled}`;
      });

      expect(testFunc({name: 'test'})).toEqual('test: true');
    })

    it('should throw an error if the input is invalid', () => {
      const testFunc = makeFunction(testSchema, (params) => {
        return `${params.name}: ${params.enabled}`;
      });

      // @ts-expect-error Missing `name` field
      expect(() => testFunc({})).toThrowError(InvalidParametersError);
    });

    it('should include a message about the invalid input in the error', () => {
      const testFunc = makeFunction(testSchema, (params) => {
        return `${params.name}: ${params.enabled}`;
      });


      try {
        // @ts-expect-error Missing `name` field
        testFunc({});
        expect(true, 'should not succeed').toEqual(false); // should not reach this point
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidParametersError);
        expect((error as InvalidParametersError).message).toEqual('Invalid parameters: Invalid key: Expected \"name\" but received undefined');
        expect((error as InvalidParametersError).issues).toEqual([expect.objectContaining({
          path: [{input: {}, key: 'name', origin: 'key', type: 'object', value: undefined}],
          message: 'Invalid key: Expected \"name\" but received undefined'
        })]);
      }
    });

    it('should work with a non-object schema', () => {
      const testFunc = makeFunction(v.string(), (val) => val.toUpperCase());

      expect(testFunc('test')).toEqual('TEST');
    });

    it('should work with transforms', () => {
      const testFunc = makeFunction(v.pipe(v.string(), v.transform(val => val.toUpperCase())), (val) => val);

      expect(testFunc('test')).toEqual('TEST');
    });

    it('should throw an error if attempting to use with an async schema', () => {
      const testFunc = makeFunction(
        v.pipeAsync(
          v.string(),
          v.transform((val) => Promise.resolve(val))
        ),
        (val) => val
      );

      expect(() => testFunc('test')).toThrowError('Promises are not supported in results');
    });
  });
})
