import React, { useEffect, useReducer } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

//other imports
import { listReceipts } from './src/graphql/queries'
import { createReceipt, deleteReceipt } from './src/graphql/mutations';

const initialState = { receipts: [], currentReceipt: null }
const reducer = (state, action) => {
  switch (action.type) {
    case 'QUERY':
      return { ...state, receipts: action.receipts }
    case 'SELECT':
      return { ...state, currentReceipt: action.receipt }
    case 'CREATE_RECEIPT':
      return { ...state, receipts: [...state.receipts, action.payload] }
    case 'DELETE_RECEIPT':
      return { ...state, receipts: state.receipts.filter(receipt => receipt.id !== action.payload.id) }
    default:
      return state
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    getData()
  }, [])

  async function getData() {
    const receiptData = await API.graphql(graphqlOperation(listReceipts))
    dispatch({ type: 'QUERY', receipts: receiptData.data.listReceipts.items })
  }

  const createNewReceipt = async () => {
    const receipt = { name: "Whole Foods", description: "Hummus, Large" }
    const newReceipt = await API.graphql(graphqlOperation(createReceipt, { input: receipt }))
    dispatch({ type: 'CREATE_RECEIPT', payload: newReceipt.data.createReceipt })
  }

  const deleteOldReceipt = async () => {
    const receipt = { id: state.currentReceipt }
    const oldReceipt = await API.graphql(graphqlOperation(deleteReceipt, { input: receipt }))
    console.log(oldReceipt)
    dispatch({ type: 'DELETE_RECEIPT', payload: oldReceipt.data.deleteReceipt })
  }

  const selectReceipt = receipt => {
    console.log(receipt)
    dispatch({ type: 'SELECT', receipt })
  }

  if (state.receipts === []) { return <Text>Loading...</Text> }

  return (
    <View style={styles.container}>
      <Button onPress={createNewReceipt} title='Create Receipt' />
      {state.receipts.map((receipt, i) => <Text key={receipt.id} onPress={() => selectReceipt(receipt.id)}>{receipt.name} : {receipt.description}</Text>)}
      <Button onPress={deleteOldReceipt} title='Delete Receipt' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddeeff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
});
