export const hello = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ mensagem: "Lambda funcionando com TypeScript!" }),
  };
};
