import { useEffect } from 'react';
import { View, BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider, useStore } from './src/store';
import { Toast } from './src/ui';
import { C } from './src/theme';
import { LoginScreen, HomeScreen } from './src/screens/home';
import { BMList, BMNew, BMDetail } from './src/screens/beyazmasa';
import { SYList, SYNew, SYDetail } from './src/screens/yardim';
import { DYList, DYDetail, ILList, ILDetail, ILNew } from './src/screens/icerik';
import { ESList, ESDetail, ESNew } from './src/screens/esnaf';
import { ODList } from './src/screens/odeme';
import { IYHome, IYDetail } from './src/screens/isyeri';

const SCREENS = {
  Home: HomeScreen,
  BM_List: BMList, BM_New: BMNew, BM_Detail: BMDetail,
  SY_List: SYList, SY_New: SYNew, SY_Detail: SYDetail,
  DY_List: DYList, DY_Detail: DYDetail,
  IL_List: ILList, IL_Detail: ILDetail, IL_New: ILNew,
  ES_List: ESList, ES_Detail: ESDetail, ES_New: ESNew,
  OD_List: ODList,
  IY_Home: IYHome, IY_Detail: IYDetail,
};

function Router() {
  const { hesap, stack, pop } = useStore();

  // Android geri tuşu: yığında ekran varsa bir önceki ekrana döner
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (hesap && stack.length > 1) {
        pop();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [hesap, stack.length, pop]);

  if (!hesap) return (<><StatusBar style="light" /><LoginScreen /></>);
  const top = stack[stack.length - 1];
  const Comp = SCREENS[top.name] || HomeScreen;
  // key: aynı türde ekran üst üste açılırsa durumları karışmasın
  return (
    <>
      <StatusBar style={top.name === 'Home' ? 'light' : 'dark'} />
      <Comp key={`${stack.length}-${top.name}-${JSON.stringify(top.params)}`} params={top.params} />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <View style={{ flex: 1, backgroundColor: C.bg }}>
          <Router />
          <Toast />
        </View>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
