const getUser = () => ({
    firstName: "ad",
    lastName: "cd"
});

type FunctionReturnType = ReturnType<typeof getUser>;
//{firstName: "ad"; lastName: "cd";}
