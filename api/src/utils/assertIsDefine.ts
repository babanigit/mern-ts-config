export function assertIsDefine<T>(str:string ,val: T): asserts val is NonNullable<T> {
    if (!val) {
        console.log("error from assertIsDefine");
        throw new Error("Expected 'val' to be defined, but received " + val);
    }else {
        console.log("assert value of",str , val)
    }
}
