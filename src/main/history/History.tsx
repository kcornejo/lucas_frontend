import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  SafeAreaView,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import ModalLoad from '../../support/ModalLoad';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalHistory from './ModalHistory';
import ModalHistoryEveryone from './ModalHistoryEveryone';
import {LineChart} from 'react-native-chart-kit';
import moment from 'moment';
import {LucasContext} from '../../support/Contexts';
import {history_gym, history_gym_complete} from './Firebase';
import HistoryWeights from './HistoryWeights';
const History = () => {
  const [userLucas, setUserLucas] = useContext(LucasContext);
  const [modalLoadVisible, setModalLoadVisible] = useState(false);
  const [datosAgendaHistory, setDatosAgendaHistory] = useState();
  const [datosAgendaEveryone, setDatosAgendaEveryone] = useState();
  const [modalHistoryVisible, setModalHistoryVisible] = useState(false);
  const [modalHistoryEveryoneVisible, setModalHistoryEveryoneVisible] =
    useState(false);
  const [modalHistoryWeights, setModalHistoryWeights] = useState(false);
  const [dataG, setDataG] = useState([0]);
  let admin = userLucas.admin;
  useEffect(() => {
    if (admin) {
      funInfoHistoryEveryone().then(retorno => {
        if (retorno != null) {
          let new_array = [];
          const calendar = retorno.calendar;
          for (let i = 0; i < 12; i++) {
            const date_inicio = moment([moment().format('Y'), i]).format(
              'YYYY-MM-DD',
            );
            const date_final = moment([moment().format('Y'), i])
              .endOf('month')
              .format('YYYY-MM-DD');
            let find = 0;
            for (let j = 0; j < calendar.length; j++) {
              if (
                calendar[j].date >= date_inicio &&
                calendar[j].date <= date_final
              ) {
                for (let k = 0; k < calendar[j].list_user.length; k++) {
                  if (calendar[j].list_user[k].isCome == 'Si') {
                    find += calendar[j].list_user.length;
                  }
                }
              }
            }
            new_array.push(find);
          }
          setDataG(new_array);
        }
      });
    } else {
      funInfoHistory().then(retorno => {
        if (retorno != null) {
          let new_array = [];
          const calendar = retorno.calendar;
          for (let i = 0; i < 12; i++) {
            const date_inicio = moment([moment().format('Y'), i]).format(
              'YYYY-MM-DD',
            );
            const date_final = moment([moment().format('Y'), i])
              .endOf('month')
              .format('YYYY-MM-DD');
            let find = 0;
            for (let j = 0; j < calendar.length; j++) {
              if (
                calendar[j].Date >= date_inicio &&
                calendar[j].Date <= date_final &&
                calendar[j].IsCome == 'Si'
              ) {
                find++;
              }
            }
            new_array.push(find);
          }
          setDataG(new_array);
        }
      });
    }
  }, [userLucas]);
  const funInfoHistory = async () => {
    setModalLoadVisible(true);
    const result = await history_gym({
      email: userLucas.email,
    });
    try {
      setModalLoadVisible(false);
      if (result != null) {
        setDatosAgendaHistory(result);
      } else {
        Alert.alert('Error', 'Error de comunicación.');
      }
    } catch (e) {
      //console.warn(e.message);
    }

    return result;
  };
  const funInfoHistoryEveryone = async () => {
    setModalLoadVisible(true);
    const result = await history_gym_complete({});
    try {
      setModalLoadVisible(false);
      if (result != null) {
        setDatosAgendaEveryone(result);
      } else {
        Alert.alert('Error', 'Error de comunicación.');
      }
    } catch (e) {
      //console.warn(e.message);
    }
    return result;
  };
  const funHistory = async () => {
    if (admin) {
      await funInfoHistory();
    }
    setModalHistoryVisible(true);
  };
  const funHistoryEveryone = async () => {
    await funInfoHistoryEveryone();
    setModalHistoryEveryoneVisible(true);
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
        data: dataG,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Entrenos'],
  };
  const screenWidth = Dimensions.get('window').width * 0.85;
  const chartConfig = {
    backgroundGradientFrom: '#818187',
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    useShadowColorFromDataset: true, // optional
    decimalPlaces: 0,
  };
  return (
    <>
      <SafeAreaView style={{backgroundColor: '#23263E', height: '100%'}}>
        <ModalLoad viewed={modalLoadVisible} />
        <Modal visible={modalHistoryVisible} animationType="slide">
          <ModalHistory
            setVisible={setModalHistoryVisible}
            data={datosAgendaHistory}
          />
        </Modal>

        <Modal visible={modalHistoryEveryoneVisible} animationType="slide">
          <ModalHistoryEveryone
            setVisible={setModalHistoryEveryoneVisible}
            data={datosAgendaEveryone}
          />
        </Modal>
        <Modal visible={modalHistoryWeights} animationType="slide">
          <HistoryWeights setVisible={setModalHistoryWeights} />
        </Modal>
        <View style={{margin: 30, flex: 1, flexDirection: 'column'}}>
          <View style={{flex: 6}}>
            <Text style={{fontWeight: '600', color: 'white', fontSize: 40}}>
              Historial
            </Text>
            <Text
              style={{
                fontWeight: '400',
                color: '#818187',
                fontSize: 20,
                marginTop: 10,
              }}>
              {!admin
                ? 'Historial de tus entrenos'
                : 'Historial de los entrenos'}
            </Text>
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
            <View style={{flex: 1, flexDirection: 'row', marginTop: 30}}>
              <View style={{flex: 1, marginRight: 10, alignItems: 'center'}}>
                <TouchableHighlight
                  activeOpacity={0.85}
                  underlayColor={'#6166A8'}
                  onPress={funHistory}
                  style={{
                    width: '80%',
                    borderRadius: 10,
                    borderColor: 'black',
                    backgroundColor: '#36395E',
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      margin: 10,
                    }}>
                    <Icon name="book" size={50} color="white" />
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: '800',
                        fontSize: 13,
                        marginTop: 10,
                        width: '100%',
                      }}>
                      Historial de{'\n'}Asistencias
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
              <View style={{flex: 1, marginLeft: 10, alignItems: 'center'}}>
                <TouchableHighlight
                  activeOpacity={0.85}
                  underlayColor={'#6166A8'}
                  onPress={() => {
                    setModalHistoryWeights(true);
                  }}
                  style={{
                    width: '80%',
                    borderRadius: 10,
                    borderColor: 'black',
                    backgroundColor: '#36395E',
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      margin: 10,
                    }}>
                    <Icon name="odnoklassniki" size={50} color="white" />
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: '800',
                        fontSize: 13,
                        marginTop: 10,
                        width: '100%',
                      }}>
                      Historial de Medidas
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>

            <View style={{flex: 1, flexDirection: 'row'}}>
              {admin ? (
                <View style={{flex: 1, marginLeft: 0, alignItems: 'center'}}>
                  <TouchableHighlight
                    activeOpacity={0.85}
                    underlayColor={'#6166A8'}
                    onPress={funHistoryEveryone}
                    style={{
                      width: '90%',
                      borderRadius: 10,
                      borderColor: 'black',
                      backgroundColor: '#36395E',
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        margin: 10,
                      }}>
                      <Icon name="user" size={40} color="white" />
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          fontWeight: '800',
                          fontSize: 13,
                          marginTop: 10,
                          width: '100%',
                        }}>
                        Historial de Todos
                      </Text>
                    </View>
                  </TouchableHighlight>
                </View>
              ) : (
                <></>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
export default History;
