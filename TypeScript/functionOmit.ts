interface ABCD{
    a: string;
    b: number;
    c: boolean;
    d: string;
};

type CD = Omit<ABCD, "a" | "b">;
// Return {c: string; d:number}