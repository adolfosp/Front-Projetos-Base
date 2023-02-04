interface ABCD{
    a: string;
    b: number;
    c: boolean;
    d: string;
};

type PartialABCD = Partial<ABCD>;
// Return {a?:string; b?:number; c?: string; d?:number}