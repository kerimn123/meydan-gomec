import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import * as D from './data';

const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [hesap, setHesap] = useState(null); // 'bireysel' | 'kurumsal' | null (giriş ekranı)
  const [stack, setStack] = useState([{ name: 'Home', params: {} }]);
  const [talepler, setTalepler] = useState(D.TALEPLER);
  const [yardimlar, setYardimlar] = useState(D.YARDIM_BASVURULARI);
  const [ilanlar] = useState(D.ILANLAR);
  const [ilanlarim, setIlanlarim] = useState(D.BENIM_ILANLARIM);
  const [paylasimlar, setPaylasimlar] = useState(D.PAYLASIMLAR);
  const [odemeler, setOdemeler] = useState(D.ODEMELER);
  const [isyeriBasvurulari, setIsyeriBasvurulari] = useState([]);
  const [okunanDuyurular, setOkunan] = useState({});
  const [toast, setToast] = useState(null);

  const push = useCallback((name, params = {}) => setStack((s) => [...s, { name, params }]), []);
  const pop = useCallback(() => {
    let popped = false;
    setStack((s) => {
      if (s.length > 1) {
        popped = true;
        return s.slice(0, -1);
      }
      return s;
    });
    return popped;
  }, []);
  const resetTo = useCallback((name, params = {}) => setStack([{ name: 'Home', params: {} }, ...(name === 'Home' ? [] : [{ name, params }])]), []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }, []);

  const value = useMemo(() => ({
    hesap, setHesap, stack, push, pop, resetTo, toast, showToast,
    talepler, setTalepler, yardimlar, setYardimlar, ilanlar, ilanlarim, setIlanlarim,
    paylasimlar, setPaylasimlar, odemeler, setOdemeler, isyeriBasvurulari, setIsyeriBasvurulari,
    okunanDuyurular, setOkunan,
  }), [hesap, stack, push, pop, resetTo, toast, showToast, talepler, yardimlar, ilanlar, ilanlarim,
    paylasimlar, odemeler, isyeriBasvurulari, okunanDuyurular]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
