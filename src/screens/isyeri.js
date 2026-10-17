import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';
import { useStore } from '../store';
import { ISLETME_TURLERI, EK_FAALIYETLER, ISYERI_ADIMLAR } from '../data';
import { Screen, Card, Badge, Muted, H2, H3, Btn, Row, Notice, Eyebrow, T } from '../ui';
import { fmt, newId } from '../util';

const otomatik = (b) => /otomatik|Uygulama içinden/i.test(`${b.kurum} ${b.not || ''}`);

export function IYHome() {
  const { push, isyeriBasvurulari, hesap } = useStore();
  return (
    <Screen title={hesap === 'kurumsal' ? 'İşyeri ve Ruhsat' : 'İşyeri Açma'} subtitle="Adımlar ve gerekli evraklar">
      <Notice tone="blue" icon="information-circle-outline">İşletme türünü seçin; hangi adımları izleyeceğinizi, hangi belgenin hangi kurumdan alınacağını görün ve belgelerinizi buradan yükleyin.</Notice>
      {isyeriBasvurulari.length ? (
        <>
          <Eyebrow>Başvurularım</Eyebrow>
          {isyeriBasvurulari.map((b) => (
            <Card key={b.id}>
              <Row style={{ justifyContent: 'space-between' }}><H3 style={{ flex: 1 }}>{b.ad}</H3><Badge text={b.durum} /></Row>
              <Muted>Başvuru no: {b.id} · {fmt(b.tarih)}</Muted>
              <Muted>İlgili birim: {b.birim}</Muted>
            </Card>
          ))}
        </>
      ) : null}
      <Eyebrow>Yeni işyeri açma</Eyebrow>
      {ISLETME_TURLERI.map((t) => (
        <Card key={t.id} onPress={() => push('IY_Detail', { kind: 'yeni', id: t.id })}>
          <Row>
            <Ionicons name={t.ikon} size={24} color={C.blue} />
            <View style={{ flex: 1 }}>
              <H3>{t.ad}</H3>
              <Muted>{t.belgeler.length} belge · {ISYERI_ADIMLAR.length} adım</Muted>
            </View>
            <Ionicons name="chevron-forward" size={20} color={C.faint} />
          </Row>
        </Card>
      ))}
      <Eyebrow>Mevcut işletmeye ek faaliyet</Eyebrow>
      {EK_FAALIYETLER.map((t) => (
        <Card key={t.id} onPress={() => push('IY_Detail', { kind: 'ek', id: t.id })}>
          <Row>
            <Ionicons name={t.ikon} size={24} color={C.amberDark} />
            <View style={{ flex: 1 }}>
              <H3>{t.ad}</H3>
              <Muted>{t.belgeler.length} belge · {t.birim}</Muted>
            </View>
            <Ionicons name="chevron-forward" size={20} color={C.faint} />
          </Row>
        </Card>
      ))}
    </Screen>
  );
}

const EK_ADIMLAR = [
  { baslik: 'Belgelerin yüklenmesi', metin: 'Aşağıdaki belgeler hazırlanır ve yüklenir. Mevcut ruhsat bilgileri belediye kayıtlarından otomatik alınır.', birim: 'Başvuru sahibi' },
  { baslik: 'Birim değerlendirmesi', metin: 'Başvuru ilgili birimin onay kuyruğuna düşer; gerekirse yerinde inceleme yapılır.', birim: 'İlgili birim' },
  { baslik: 'Harç ve izin', metin: 'Varsa harç ödemesi Yaklaşan Ödemeler’e eklenir; ödeme sonrası izin belgesi uygulamada görüntülenir.', birim: 'Gelirler' },
];

export function IYDetail({ params }) {
  const { setIsyeriBasvurulari, pop, showToast } = useStore();
  const yeni = params.kind === 'yeni';
  const kayit = (yeni ? ISLETME_TURLERI : EK_FAALIYETLER).find((x) => x.id === params.id);
  const adimlar = yeni ? ISYERI_ADIMLAR : EK_ADIMLAR;
  const [yuklenen, setYuklenen] = useState(() => Object.fromEntries(kayit.belgeler.filter(otomatik).map((b) => [b.ad, true])));
  const [acikAdim, setAcikAdim] = useState(0);
  const tamam = kayit.belgeler.filter((b) => yuklenen[b.ad]).length;
  const hepsi = tamam === kayit.belgeler.length;

  const gonder = () => {
    setIsyeriBasvurulari((l) => [{ id: 'R-' + newId(), ad: kayit.ad, durum: 'İncelemede', tarih: new Date(), birim: yeni ? 'Ruhsat Birimi' : kayit.birim }, ...l]);
    pop();
    showToast('Başvurunuz Ruhsat Birimi’ne iletildi');
  };

  return (
    <Screen title={kayit.ad} subtitle={yeni ? 'Yeni işyeri açma' : 'Ek faaliyet başvurusu'}
      footer={<Btn title={hepsi ? 'Başvuruyu gönder' : `Eksik belge: ${kayit.belgeler.length - tamam}`} icon="send" disabled={!hepsi} onPress={gonder} />}>
      <Eyebrow>Adımlar</Eyebrow>
      {adimlar.map((a, i) => (
        <Pressable key={i} onPress={() => setAcikAdim(acikAdim === i ? -1 : i)}>
          <Card highlight={acikAdim === i}>
            <Row>
              <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: C.amber, fontWeight: '800' }}>{i + 1}</Text>
              </View>
              <H3 style={{ flex: 1 }}>{a.baslik}</H3>
              <Ionicons name={acikAdim === i ? 'chevron-up' : 'chevron-down'} size={18} color={C.faint} />
            </Row>
            {acikAdim === i ? (
              <>
                <T>{a.metin}</T>
                <Muted>Sorumlu: {a.birim}</Muted>
              </>
            ) : null}
          </Card>
        </Pressable>
      ))}

      <Row style={{ justifyContent: 'space-between', marginTop: 6 }}>
        <Eyebrow>Gerekli evraklar</Eyebrow>
        <Text style={{ fontWeight: '800', color: hepsi ? C.ok : C.amberDark, marginTop: 6 }}>{tamam} / {kayit.belgeler.length}</Text>
      </Row>
      <View style={{ height: 8, borderRadius: 4, backgroundColor: C.line2, overflow: 'hidden' }}>
        <View style={{ width: `${(tamam / kayit.belgeler.length) * 100}%`, height: 8, backgroundColor: hepsi ? C.ok : C.blue }} />
      </View>
      {kayit.belgeler.map((b) => {
        const ok = !!yuklenen[b.ad];
        const oto = otomatik(b);
        return (
          <Card key={b.ad} style={ok ? { borderColor: C.ok } : null}>
            <Row style={{ alignItems: 'flex-start' }}>
              <Ionicons name={ok ? 'checkmark-circle' : 'document-text-outline'} size={22} color={ok ? C.ok : C.faint} />
              <View style={{ flex: 1, gap: 2 }}>
                <T style={{ fontWeight: '700' }}>{b.ad}</T>
                <Muted style={{ fontSize: 13 }}>Nereden: {b.kurum}</Muted>
              </View>
              {oto ? (
                <Badge text="Hazır" fg={C.ok} bg={C.okSoft} />
              ) : (
                <Pressable onPress={() => setYuklenen({ ...yuklenen, [b.ad]: !ok })} hitSlop={8}>
                  <Text style={{ color: C.blue, fontWeight: '800' }}>{ok ? 'Kaldır' : 'Yükle'}</Text>
                </Pressable>
              )}
            </Row>
          </Card>
        );
      })}
      <Notice icon="alert-circle-outline">Bu liste demo amaçlı örnek bir listedir. Kesin evrak listesi belediyenin Ruhsat Birimi ile birlikte işletme türüne göre hazırlanacaktır.</Notice>
    </Screen>
  );
}
