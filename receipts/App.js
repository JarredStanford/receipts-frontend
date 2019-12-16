import React, { useEffect, useReducer } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import API, { graphqlOperation } from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub';
import { createReceipt } from './src/graphql/mutations';

//import and configure access to Amplify
import config from './aws-exports'
API.configure(config) //Cofnigure Amplify
PubSub.configure(config)

//other imports
import { onCreateReceipt } from './src/graphql/subscriptions'
import { listReceipts } from './src/graphql/queries'

const initialState = { receipts: [] }
const reducer = (state, action) => {
  switch (action.type) {
    case 'QUERY':
      return { ...state, receipts: action.receipts }
    case 'SUBSCRIPTION':
      return { ...state, receipts: [...state.receipts, action.receipt] }
    default:
      return state
  }
}

async function createNewReceipt() {
  const receipt = { name: "Whole Foods", description: "Hummus, Large" }
  await API.graphQL(graphqlOperation(createReceipt, { input: receipt }))

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

  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onCreateReceipt)).subscribe({
      next: (eventData) => {
        const receipt = eventData.value.data.onCreateReceipt
        dispatch({ type: 'SUBSCRIPTION', receipt })
      }
    })

    return () => subscription.unsubscribe()

  })


  return (
    <View style={styles.container}>
      <Button onPress={createNewReceipt} title='Create Receipt' />
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
