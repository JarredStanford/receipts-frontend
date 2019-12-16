/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createReceipt = `mutation CreateReceipt(
  $input: CreateReceiptInput!
  $condition: ModelReceiptConditionInput
) {
  createReceipt(input: $input, condition: $condition) {
    id
    name
    description
  }
}
`;
export const updateReceipt = `mutation UpdateReceipt(
  $input: UpdateReceiptInput!
  $condition: ModelReceiptConditionInput
) {
  updateReceipt(input: $input, condition: $condition) {
    id
    name
    description
  }
}
`;
export const deleteReceipt = `mutation DeleteReceipt(
  $input: DeleteReceiptInput!
  $condition: ModelReceiptConditionInput
) {
  deleteReceipt(input: $input, condition: $condition) {
    id
    name
    description
  }
}
`;
