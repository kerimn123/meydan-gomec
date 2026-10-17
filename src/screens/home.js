import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';
import { useStore } from '../store';
import { KULLANICILAR, DUYURULAR } from '../data';
import { Card, Badge, Muted, H3, Btn, Row } from '../ui';
import { dayDiff, fmtShort, money, relDay } from '../util';

export function LoginScreen() {
  const { setHesap, resetTo } = useStore();
  const insets = useSafeAreaInsets();
  const [tip, setTip] = useState('bireysel');
  const [kimlik, setKimlik] = useState('');
  const [tel, setTel] = useState('');
  const [kodGonderildi, setKod] = useState(false);

  const giris = () => {
    resetTo('Home');
    setHesap(tip);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.green }} contentContainerStyle={{ padding: 24, paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24, gap: 18 }} keyboardShouldPersistTaps="handled">
      <Text style={l.eyebrow}>Gömeç Belediyesi</Text>
      <Text style={l.logo}>Meydan</Text>
      <Text style={l.tag}>Gömeç’in dijital meydanı</Text>
      <View style={l.panel}>
        <View style={l.seg}>
          {['bireysel', 'kurumsal'].map((t) => (
            <Pressable key={t} onPress={() => setTip(t)} style={[l.segBtn, tip === t && l.segOn]}>
              <Text style={[l.segT, tip === t && { color: C.light }]}>{t === 'bireysel' ? 'Bireysel' : 'Kurumsal'}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={l.label}>{tip === 'bireysel' ? 'T.C. Kimlik No' : 'VKN veya TCKN'}</Text>
        <TextInput style={l.input} value={kimlik} onChangeText={setKimlik} keyboardType="number-pad" maxLength={11}
          placeholder={tip === 'bireysel' ? '11 haneli numara' : '10 veya 11 haneli numara'} placeholderTextColor={C.faint} />
        <Text style={l.label}>Cep telefonu</Text>
        <TextInput style={l.input} value={tel} onChangeText={setTel} keyboardType="phone-pad" placeholder="05__ ___ __ __" placeholderTextColor={C.faint} />
        {kodGonderildi ? (
          <>
            <Text style={l.label}>Onay kodu</Text>
            <TextInput style={l.input} defaultValue="246810" keyboardType="number-pad" />
            <Btn title="Giriş yap" onPress={giris} />
          </>
        ) : (
          <Btn title="Onay kodu gönder" onPress={() => setKod(true)} />
        )}
        <Btn title="e-Devlet ile giriş yap" variant="outline" icon="shield-checkmark-outline" onPress={giris} />
        <Pressable onPress={giris}><Text style={l.demo}>Demo hesabıyla hızlı giriş</Text></Pressable>
      </View>
      <Text style={l.foot}>Bu bir demo uygulamadır. Tüm veriler örnektir.</Text>
    </ScrollView>
  );
}

const MODULLER = {
  bireysel: [
    { name: 'BM_List', ad: 'Beyaz Masa', alt: 'Talep ve şikâyet', icon: 'chatbubbles-outline' },
    { name: 'SY_List', ad: 'Sosyal Yardım', alt: 'Başvuru ve takip', icon: 'heart-outline' },
    { name: 'DY_List', ad: 'Belediye Duyuruları', alt: 'Resmî duyurular', icon: 'megaphone-outline' },
    { name: 'ES_List', ad: 'Esnaf Tanıtımları', alt: 'Kampanya, menü, saatler', icon: 'storefront-outline' },
    { name: 'IL_List', ad: 'İlanlar', alt: 'Vefat, düğün, satılık…', icon: 'newspaper-outline' },
    { name: 'OD_List', ad: 'Yaklaşan Ödemeler', alt: 'Vergi ve harçlar', icon: 'wallet-outline' },
    { name: 'IY_Home', ad: 'İşyeri Açma', alt: 'Adımlar ve evraklar', icon: 'briefcase-outline' },
  ],
  kurumsal: [
    { name: 'ES_List', ad: 'Esnaf Tanıtımları', alt: 'Paylaşım yap', icon: 'storefront-outline', params: { mine: true } },
    { name: 'OD_List', ad: 'Yaklaşan Ödemeler', alt: 'Kira, işgaliye, vergi', icon: 'wallet-outline' },
    { name: 'IY_Home', ad: 'İşyeri ve Ruhsat', alt: 'Yeni işyeri, ek faaliyet', icon: 'briefcase-outline' },
    { name: 'DY_List', ad: 'Belediye Duyuruları', alt: 'Resmî duyurular', icon: 'megaphone-outline' },
    { name: 'IL_List', ad: 'İlanlar', alt: 'İş ilanı, kiralık…', icon: 'newspaper-outline' },
    { name: 'BM_List', ad: 'Beyaz Masa', alt: 'Talep ve şikâyet', icon: 'chatbubbles-outline' },
  ],
};

export function HomeScreen() {
  const st = useStore();
  const { hesap, setHesap, push, talepler, yardimlar, odemeler, okunanDuyurular, showToast } = st;
  const insets = useSafeAreaInsets();
  const user = KULLANICILAR[hesap];
  const acikTalep = talepler.filter((t) => t.durum !== 'Kapatıldı').length;
  const bekleyenOdeme = odemeler[hesap].filter((o) => o.durum !== 'Ödendi');
  const enYakin = [...bekleyenOdeme].sort((a, b) => a.sonGun - b.sonGun)[0];
  const okunmamis = DUYURULAR.filter((d) => !okunanDuyurular[d.id]).length;
  const onemli = DUYURULAR.find((d) => d.onemli);

  const sayac = {
    BM_List: acikTalep ? `${acikTalep} açık talep` : null,
    SY_List: yardimlar.some((y) => y.durum === 'Eksik belge') ? 'Eksik belge var' : null,
    DY_List: okunmamis ? `${okunmamis} yeni` : null,
    OD_List: bekleyenOdeme.length ? `${bekleyenOdeme.length} bekleyen` : null,
  };

  const hesapDegistir = () => {
    const yeni = hesap === 'bireysel' ? 'kurumsal' : 'bireysel';
    setHesap(yeni);
    showToast(yeni === 'kurumsal' ? 'Kurumsal hesaba geçildi' : 'Bireysel hesaba geçildi');
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={[h.top, { paddingTop: insets.top + 14 }]}>
        <Row style={{ justifyContent: 'space-between' }}>
          <View>
            <Text style={h.logo}>Meydan</Text>
            <Text style={h.sub}>Gömeç Belediyesi</Text>
          </View>
          <Row>
            <Pressable onPress={hesapDegistir} style={h.iconBtn} accessibilityLabel="Hesap değiştir">
              <Ionicons name="swap-horizontal" size={22} color={C.light} />
            </Pressable>
            <Pressable onPress={() => setHesap(null)} style={h.iconBtn} accessibilityLabel="Çıkış">
              <Ionicons name="log-out-outline" size={22} color={C.light} />
            </Pressable>
          </Row>
        </Row>
        <Pressable onPress={hesapDegistir} style={h.user}>
          <Ionicons name={hesap === 'bireysel' ? 'person-circle-outline' : 'business-outline'} size={34} color={C.amber} />
          <View style={{ flex: 1 }}>
            <Text style={h.userName}>{user.ad}</Text>
            <Text style={h.userSub}>{hesap === 'bireysel' ? 'Bireysel hesap' : 'Kurumsal hesap'} · {user.kimlik}</Text>
          </View>
          <Text style={h.switchT}>Değiştir</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: insets.bottom + 24 }}>
        {onemli ? (
          <Card onPress={() => push('DY_Detail', { id: onemli.id })} style={{ backgroundColor: C.green, borderColor: C.green }}>
            <Row>
              <Ionicons name="megaphone" size={18} color={C.amber} />
              <Text style={{ color: C.amber, fontWeight: '800', fontSize: 13 }}>ÖNEMLİ DUYURU · {relDay(onemli.tarih).toUpperCase()}</Text>
            </Row>
            <Text style={{ color: C.light, fontSize: 17, fontWeight: '800' }}>{onemli.baslik}</Text>
            <Text style={{ color: C.lightMuted, fontSize: 14 }} numberOfLines={2}>{onemli.metin}</Text>
          </Card>
        ) : null}

        <View style={h.grid}>
          {MODULLER[hesap].map((m) => (
            <Pressable key={m.name} onPress={() => push(m.name, m.params || {})} style={({ pressed }) => [h.tile, pressed && { opacity: 0.75 }]}>
              <Ionicons name={m.icon} size={28} color={C.blue} />
              <Text style={h.tileT}>{m.ad}</Text>
              <Text style={h.tileS}>{m.alt}</Text>
              {sayac[m.name] ? <Badge text={sayac[m.name]} fg={C.amberDark} bg={C.amberSoft} style={{ marginTop: 4 }} /> : null}
            </Pressable>
          ))}
        </View>

        {enYakin ? (
          <Card onPress={() => push('OD_List')}>
            <Row style={{ justifyContent: 'space-between' }}>
              <H3>En yakın ödeme</H3>
              <Badge text={enYakin.durum === 'Gecikmiş' ? 'Gecikmiş' : `${dayDiff(enYakin.sonGun)} gün kaldı`}
                fg={enYakin.durum === 'Gecikmiş' ? C.red : C.amberDark} bg={enYakin.durum === 'Gecikmiş' ? C.redSoft : C.amberSoft} />
            </Row>
            <Text style={{ fontSize: 15, color: C.text }}>{enYakin.kalem}</Text>
            <Row style={{ justifyContent: 'space-between' }}>
              <Muted>Son gün: {fmtShort(enYakin.sonGun)}</Muted>
              <Text style={{ fontSize: 17, fontWeight: '800', color: C.text }}>{money(enYakin.tutar)}</Text>
            </Row>
          </Card>
        ) : null}

        <Muted style={{ textAlign: 'center', fontSize: 12, marginTop: 8 }}>Demo sürüm · Tüm veriler örnektir</Muted>
      </ScrollView>
    </View>
  );
}

const l = StyleSheet.create({
  eyebrow: { color: C.amber, fontWeight: '800', letterSpacing: 2, fontSize: 13, textTransform: 'uppercase' },
  logo: { color: C.light, fontSize: 52, fontWeight: '800', fontFamily: 'serif' },
  tag: { color: C.lightMuted, fontSize: 17, marginTop: -8 },
  panel: { backgroundColor: C.bg, borderRadius: 24, padding: 18, gap: 10, marginTop: 12 },
  seg: { flexDirection: 'row', backgroundColor: C.bg2, borderRadius: 14, padding: 4, marginBottom: 6 },
  segBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  segOn: { backgroundColor: C.green },
  segT: { fontSize: 15, fontWeight: '800', color: C.text },
  label: { fontSize: 14, fontWeight: '700', color: C.text },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: C.line2, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: C.text },
  demo: { textAlign: 'center', color: C.blue, fontWeight: '800', fontSize: 15, paddingVertical: 6 },
  foot: { color: C.lightMuted, textAlign: 'center', fontSize: 13 },
});

const h = StyleSheet.create({
  top: { backgroundColor: C.green, paddingHorizontal: 16, paddingBottom: 16, gap: 14 },
  logo: { color: C.light, fontSize: 30, fontWeight: '800', fontFamily: 'serif' },
  sub: { color: C.lightMuted, fontSize: 13 },
  iconBtn: { padding: 8, borderRadius: 12, backgroundColor: C.green2 },
  user: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.green2, borderRadius: 16, padding: 12 },
  userName: { color: C.light, fontSize: 16, fontWeight: '800' },
  userSub: { color: C.lightMuted, fontSize: 12 },
  switchT: { color: C.amber, fontWeight: '800', fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: { width: '48%', flexGrow: 1, backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.line, padding: 14, gap: 4, minHeight: 120 },
  tileT: { fontSize: 16, fontWeight: '800', color: C.text, marginTop: 6 },
  tileS: { fontSize: 13, color: C.muted },
});
