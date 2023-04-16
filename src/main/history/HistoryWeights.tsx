import React from 'react';
import {
  ScrollView,
  NativeBaseProvider,
  VStack,
  Heading,
  Stack,
} from 'native-base';
import {Pressable, Text, SafeAreaView, Dimensions} from 'react-native';
import {styles} from '../Styles';
import {LineChart} from 'react-native-chart-kit';
const HistoryWeights = ({setVisible}) => {
  const screenWidth = Dimensions.get('window').width * 0.85;
  const chartConfig = {
    backgroundGradientFrom: '#FFF',
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    useShadowColorFromDataset: true, // optional
    decimalPlaces: 0,
  };
  const data = {
    labels: [
      'En',
      'Fe',
      'Ma',
      'Ab',
      'Ma',
      'Jn',
      'Jl',
      'Ag',
      'Se',
      'Oc',
      'No',
      'Di',
    ],
    datasets: [
      {
        data: [],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [],
        color: (opacity = 1) => `rgba(12, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Brazo', 'Cintura', 'Abdomen', 'Cadera', 'Pierna'],
  };
  return (
    <NativeBaseProvider>
      <SafeAreaView style={{backgroundColor: '#23263E', height: '100%'}}>
        <ScrollView w="100%">
          <VStack alignItems="center" mt={5}>
            <Heading size="sm">Brazo</Heading>
          </VStack>
          <Stack mx="5%" my={5}>
            <LineChart
              data={data}
              style={{marginTop: 10}}
              width={screenWidth}
              height={200}
              chartConfig={chartConfig}
              bezier
              segments={4}
              yAxisInterval={1}
            />
          </Stack>
          <Pressable
            style={styles.button}
            onPress={() => {
              setVisible(false);
            }}>
            <Text style={styles.textButton}>Regresar</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};
export default HistoryWeights;
