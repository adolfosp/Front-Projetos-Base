interface ABCD{
    a: string;
    b: number;
    c: boolean;
    d: string;
};

type AB = Pick<ABCD, "a" | "b">;
// Return {a: string; b:number}