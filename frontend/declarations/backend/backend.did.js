export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getShaderCode' : IDL.Func([], [IDL.Text], ['query']),
    'getShaderExamples' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
        ['query'],
      ),
    'getTime' : IDL.Func([], [IDL.Int], []),
    'updateShaderCode' : IDL.Func([IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
