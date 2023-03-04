import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {BASE_URL} from '@env';
import ModalLoad from '../support/ModalLoad';
import Icon from 'react-native-vector-icons/FontAwesome';
import Support from '../support/Support';
import ModalHistory from './ModalHistory';
import ModalHistoryEveryone from './ModalHistoryEveryone';
import {LineChart} from 'react-native-chart-kit';
import moment from 'moment';
const History = ({userLucas, setUserLucas}) => {
  const [modalLoadVisible, setModalLoadVisible] = useState(false);
  const [datosAgendaHistory, setDatosAgendaHistory] = useState([]);
  const [datosAgendaEveryone, setDatosAgendaEveryone] = useState([]);
  const [modalHistoryVisible, setModalHistoryVisible] = useState(false);
  const [modalHistoryEveryoneVisible, setModalHistoryEveryoneVisible] =
    useState(false);
  const [dataG, setDataG] = useState([0]);
  let admin = userLucas.admin;
  useEffect(() => {
    if (admin) {
      funInfoHistoryEveryone().then(retorno => {
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
              find += calendar[j].list_user.length;
            }
          }
          new_array.push(find);
        }
        setDataG(new_array);
      });
    } else {
      funInfoHistory().then(retorno => {
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
              calendar[j].Date <= date_final
            ) {
              find++;
            }
          }
          new_array.push(find);
        }
        setDataG(new_array);
      });
    }
  }, [1]);
  const funInfoHistory = async () => {
    setModalLoadVisible(true);
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + userLucas.token);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    console.log(BASE_URL);
    let ret = null;
    await fetch(
      BASE_URL + '/api/calendar/list/user?email=' + userLucas.email,
      requestOptions,
    )
      .then(response => response.text())
      .then(retorno => {
        setDatosAgendaHistory(JSON.parse(retorno));
        ret = JSON.parse(retorno);
        setModalLoadVisible(false);
      })
      .catch(error => {
        Support.ErrorToken({message: error.message, setUserLucas});
      });
    return ret;
  };
  const funInfoHistoryEveryone = async () => {
    setModalLoadVisible(true);
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + userLucas.token);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    let ret = null;
    await fetch(BASE_URL + '/api/calendar/history', requestOptions)
      .then(response => response.text())
      .then(async retorno => {
        setDatosAgendaEveryone(JSON.parse(retorno));
        setModalLoadVisible(false);
        ret = JSON.parse(retorno);
      })
      .catch(error => {
        Support.ErrorToken({message: error.message, setUserLucas});
      });
    return ret;
  };
  const funHistory = async () => {
    if (admin) {
      await funInfoHistory();
    }
    setModalHistoryVisible(true);
    setModalHistoryVisible(false);
    setModalHistoryVisible(true);
  };
  const funHistoryEveryone = async () => {
    await funInfoHistoryEveryone();
    setModalHistoryEveryoneVisible(true);
    setModalHistoryEveryoneVisible(false);
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
        <ModalHistory
          visible={modalHistoryVisible}
          setVisible={setModalHistoryVisible}
          data={datosAgendaHistory}
        />
        <ModalHistoryEveryone
          visible={modalHistoryEveryoneVisible}
          setVisible={setModalHistoryEveryoneVisible}
          data={datosAgendaEveryone}
        />
        <View style={{margin: 30, flex: 1, flexDirection: 'column'}}>
          <View style={{flex: 2}}>
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
          </View>
          <View style={{flex: 6}}>
            <LineChart
              data={data}
              width={screenWidth}
              height={256}
              chartConfig={chartConfig}
              bezier
              segments={4}
              yAxisInterval={1}
            />
          </View>
          <View style={{flex: 4}}>
            <View style={{flex: 1, flexDirection: 'row', marginBottom: 30}}>
              <View style={{flex: 1, marginRight: 10}}>
                <TouchableHighlight
                  activeOpacity={0.85}
                  underlayColor={'#6166A8'}
                  onPress={funHistory}
                  style={{
                    width: '100%',
                    borderRadius: 10,
                    borderColor: 'black',
                    backgroundColor: '#36395E',
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      margin: 10,
                    }}>
                    <Icon name="book" size={80} color="white" />
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        height: 30,
                        fontWeight: '800',
                        fontSize: 13,
                        marginTop: 10,
                        width: '100%',
                      }}>
                      Historial Completo
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
              {admin ? (
                <View style={{flex: 1, marginLeft: 10}}>
                  <TouchableHighlight
                    activeOpacity={0.85}
                    underlayColor={'#6166A8'}
                    onPress={funHistoryEveryone}
                    style={{
                      width: '100%',
                      borderRadius: 10,
                      borderColor: 'black',
                      backgroundColor: '#36395E',
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        margin: 10,
                      }}>
                      <Icon name="user" size={80} color="white" />
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          height: 30,
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
