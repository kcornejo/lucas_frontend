import React, {useState, useEffect, useContext} from 'react';
import {
  ScrollView,
  NativeBaseProvider,
  VStack,
  Heading,
  Stack,
  Center,
} from 'native-base';
import {Text, SafeAreaView, Dimensions, TouchableHighlight} from 'react-native';
import {styles} from '../Styles';
import {LineChart} from 'react-native-chart-kit';
import {get_weights} from './Firebase';
import ModalLoad from '../../support/ModalLoad';
import {LucasContext} from '../../support/Contexts';
const HistoryWeights = ({setVisible, visible}) => {
  const [userLucas, setUserLucas] = useContext(LucasContext);
  const [valueCharge, setValueCharge] = useState(false);
  const [load, setLoad] = useState(false);
  const [dataBP, setDataBP] = useState({
    labels: [],
    datasets: [
      {
        data: [0],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [0],
        color: (opacity = 1) => `rgba(23, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Brazo', 'Pierna'],
  });
  const [dataCAC, setDataCAC] = useState({
    labels: [],
    datasets: [
      {
        data: [0],
        color: (opacity = 1) => `rgba(12, 23, 244, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [0],
        color: (opacity = 1) => `rgba(10,240, 20, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [0],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Cintura', 'Abdomen', 'Cadera'],
  });
  useEffect(() => {
    if (visible) {
      setLoad(true);
      get_weights(userLucas.email).then(weights => {
        setValueCharge(false);
        const weights_reverse = weights.reverse();
        if (weights_reverse.length > 0) {
          const legendBP = ['Brazo', 'Pierna'];
          const legendCAC = ['Cintura', 'Abdomen', 'Cadera'];
          let labels = [];
          for (let i = 0; i < weights_reverse.length; i++) {
            labels.push(weights_reverse[i].fecha);
          }
          let data_brazo = [];
          for (let i = 0; i < weights_reverse.length; i++) {
            data_brazo.push(weights_reverse[i].brazo);
          }
          let data_pierna = [];
          for (let i = 0; i < weights_reverse.length; i++) {
            data_pierna.push(weights_reverse[i].pierna);
          }
          let data_cintura = [];
          for (let i = 0; i < weights_reverse.length; i++) {
            data_cintura.push(weights_reverse[i].cintura);
          }
          let data_abdomen = [];
          for (let i = 0; i < weights_reverse.length; i++) {
            data_abdomen.push(weights_reverse[i].abdomen);
          }
          let data_cadera = [];
          for (let i = 0; i < weights_reverse.length; i++) {
            data_cadera.push(weights_reverse[i].cadera);
          }
          setDataBP({
            labels,
            datasets: [
              {
                data: data_brazo,
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: data_pierna,
                color: (opacity = 1) => `rgba(23, 65, 244, ${opacity})`,
                strokeWidth: 2,
              },
            ],
            legend: legendBP,
          });
          setDataCAC({
            labels,
            datasets: [
              {
                data: data_cintura,
                color: (opacity = 1) => `rgba(12, 23, 244, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: data_abdomen,
                color: (opacity = 1) => `rgba(10,240, 20, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: data_cadera,
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                strokeWidth: 2,
              },
            ],
            legend: legendCAC,
          });
        }

        setLoad(false);
        setValueCharge(true);
      });
    }
  }, [visible]);
  const screenWidth = Dimensions.get('window').width * 0.9;
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
        color: (opacity = 1) => `rgba(10, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Brazo', 'Pierna'],
  };
  const dataCin = {
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
        color: (opacity = 1) => `rgba(10, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [],
        color: (opacity = 1) => `rgba(30, 130, 10, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Cintura', 'Abdomen', 'Cadera'],
  };
  return (
    <NativeBaseProvider>
      <ModalLoad viewed={load} />
      <SafeAreaView style={{backgroundColor: '#23263E', height: '100%'}}>
        <ScrollView w="100%">
          <VStack alignItems="center" mt={5}>
            <Heading size="lg" color="white">
              Brazo y Pierna
            </Heading>
          </VStack>
          <Stack mx="5%" my={5}>
            <Center>
              {valueCharge && (
                <LineChart
                  data={dataBP}
                  style={{marginTop: 10}}
                  width={screenWidth}
                  height={200}
                  chartConfig={chartConfig}
                  bezier
                  segments={4}
                  yAxisInterval={1}
                />
              )}
            </Center>
          </Stack>
          <VStack alignItems="center" mt={5}>
            <Heading size="lg" color="white">
              Cintura, Abdomen y Cadera
            </Heading>
          </VStack>
          <Stack mx="5%" my={5}>
            <Center>
              {valueCharge && (
                <LineChart
                  data={dataCAC}
                  style={{marginTop: 10}}
                  width={screenWidth}
                  height={200}
                  chartConfig={chartConfig}
                  bezier
                  segments={4}
                  yAxisInterval={1}
                />
              )}
            </Center>
          </Stack>
          <TouchableHighlight
            activeOpacity={0.85}
            underlayColor={'#6166A8'}
            style={{
              backgroundColor: '#36395E',
              borderWidth: 1,
              borderRadius: 12,
              height: 50,
              margin: 20,
            }}
            onPress={() => {
              setVisible(false);
            }}>
            <Text style={styles.textButton}>Regresar</Text>
          </TouchableHighlight>
        </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};
export default HistoryWeights;
