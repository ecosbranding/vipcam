import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const C = {
  bg: '#080808',
  bg2: '#0F0F0F',
  bg3: '#1A1A1A',
  bg4: '#242424',
  gold: '#C9A84C',
  goldLight: '#E8C96D',
  goldBg: 'rgba(201,168,76,0.12)',
  goldBorder: 'rgba(201,168,76,0.3)',
  white: '#FFFFFF',
  gray1: '#B0B0B0',
  gray2: '#606060',
  gray3: '#333333',
  red: '#FF3B3B',
  green: '#30D158',
};

function CameraScreen() {
  const [mode, setMode] = React.useState('FOTO');
  const [iso, setIso] = React.useState('400');
  const [ss, setSs] = React.useState('1/60');
  const [ev, setEv] = React.useState('0.0');
  const [wb, setWb] = React.useState('AUTO');
  const [activeControl, setActiveControl] = React.useState(null);
  const [grid, setGrid] = React.useState(true);
  const [flash, setFlash] = React.useState('off');

  const modes = ['FOTO', 'VIDEO', 'SLOW', 'TIME'];
  const ISO_VALUES = ['50','100','200','400','800','1600','3200','6400'];
  const SS_VALUES = ['1/8000','1/4000','1/2000','1/1000','1/500','1/250','1/125','1/60','1/30','1/15','1/8','1/2','1"','2"','4"'];
  const WB_VALUES = ['AUTO','DIA','NUBLADO','TUNGST','FLUOR'];

  const getControlValues = () => {
    if (activeControl === 'ISO') return ISO_VALUES;
    if (activeControl === 'SS') return SS_VALUES;
    if (activeControl === 'WB') return WB_VALUES;
    return [];
  };

  const getControlCurrent = () => {
    if (activeControl === 'ISO') return iso;
    if (activeControl === 'SS') return ss;
    if (activeControl === 'WB') return wb;
    return '';
  };

  const setControlValue = (val) => {
    if (activeControl === 'ISO') setIso(val);
    if (activeControl === 'SS') setSs(val);
    if (activeControl === 'WB') setWb(val);
  };

  return (
    <View style={s.container}>
      <StatusBar hidden />
      <View style={s.viewfinder}>
        <View style={[s.corner, s.cornerTL]} />
        <View style={[s.corner, s.cornerTR]} />
        <View style={[s.corner, s.cornerBL]} />
        <View style={[s.corner, s.cornerBR]} />

        {grid && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <View style={[s.gridLine, {top:'33%', left:0, right:0, height:1}]}/>
            <View style={[s.gridLine, {top:'66%', left:0, right:0, height:1}]}/>
            <View style={[s.gridLine, {left:'33%', top:0, bottom:0, width:1}]}/>
            <View style={[s.gridLine, {left:'66%', top:0, bottom:0, width:1}]}/>
          </View>
        )}

        <View style={s.hud}>
          <Text style={s.logo}>VIPCAM</Text>
          <View style={s.hudRight}>
            <TouchableOpacity style={s.hudBtn} onPress={() => setFlash(flash === 'off' ? 'on' : flash === 'on' ? 'auto' : 'off')}>
              <Ionicons name={flash === 'off' ? 'flash-off' : 'flash'} size={20} color={flash !== 'off' ? C.gold : C.gray2} />
            </TouchableOpacity>
            <TouchableOpacity style={s.hudBtn} onPress={() => setGrid(!grid)}>
              <Ionicons name="grid-outline" size={20} color={grid ? C.gold : C.gray2} />
            </TouchableOpacity>
            <View style={s.rawBadge}>
              <Text style={s.rawText}>RAW</Text>
            </View>
          </View>
        </View>

        <View style={s.centerInfo}>
          <Text style={s.centerMode}>{mode}</Text>
          <Text style={s.centerSub}>
            {mode === 'FOTO' ? 'Toca para enfocar' : mode === 'VIDEO' ? 'Listo para grabar' : mode === 'SLOW' ? '240fps' : 'Intervalo: 3s'}
          </Text>
        </View>

        <View style={s.bottomHud}>
          <View style={s.controlsRow}>
            {[
              { id: 'ISO', label: 'ISO', value: iso },
              { id: 'f/', label: 'f/', value: '1.8' },
              { id: 'SS', label: 'SS', value: ss },
              { id: 'WB', label: 'WB', value: wb },
              { id: 'EV', label: 'EV', value: '+' + ev },
            ].map((ctrl) => (
              <TouchableOpacity
                key={ctrl.id}
                style={[s.ctrlItem, activeControl === ctrl.id && s.ctrlItemActive]}
                onPress={() => setActiveControl(activeControl === ctrl.id ? null : ctrl.id)}
              >
                <Text style={s.ctrlLabel}>{ctrl.label}</Text>
                <Text style={[s.ctrlValue, activeControl === ctrl.id && s.ctrlValueActive]}>{ctrl.value}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeControl && ['ISO','SS','WB'].includes(activeControl) && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.valPanel} contentContainerStyle={s.valPanelContent}>
              {getControlValues().map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[s.valChip, getControlCurrent() === val && s.valChipActive]}
                  onPress={() => { setControlValue(val); setActiveControl(null); }}
                >
                  <Text style={[s.valChipText, getControlCurrent() === val && s.valChipTextActive]}>{val}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {activeControl === 'EV' && (
            <View style={s.evPanel}>
              <TouchableOpacity style={s.evBtn} onPress={() => setEv(Math.max(-3, parseFloat(ev) - 0.3).toFixed(1))}>
                <Text style={s.evBtnText}>-</Text>
              </TouchableOpacity>
              <View style={s.evCenter}>
                <Text style={s.evValue}>{parseFloat(ev) >= 0 ? '+' + ev : ev}</Text>
                <View style={s.evTrack}>
                  <View style={[s.evFill, { width: ((parseFloat(ev) + 3) / 6 * 100) + '%' }]}/>
                </View>
              </View>
              <TouchableOpacity style={s.evBtn} onPress={() => setEv(Math.min(3, parseFloat(ev) + 0.3).toFixed(1))}>
                <Text style={s.evBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={s.captureRow}>
            <TouchableOpacity style={s.galleryBtn}>
              <Ionicons name="images-outline" size={24} color={C.gray1} />
            </TouchableOpacity>

            <TouchableOpacity style={s.shutterOuter} activeOpacity={0.8}>
              <View style={s.shutterRing}>
                <View style={[s.shutterCenter, mode === 'VIDEO' && { backgroundColor: C.red, borderRadius: 8, width: 30, height: 30 }]} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={s.flipBtn}>
              <Ionicons name="camera-reverse-outline" size={26} color={C.gray1} />
            </TouchableOpacity>
          </View>

          <View style={s.modeRow}>
            {modes.map((m) => (
              <TouchableOpacity key={m} style={s.modeItem} onPress={() => { setMode(m); setActiveControl(null); }}>
                <Text style={[s.modeText, mode === m && s.modeTextActive]}>{m}</Text>
                {mode === m && <View style={s.modeDot}/>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

function PresetsScreen() {
  const presets = [
    { name: 'KODAK PORTRA 400', tag: 'FILM CLASICO', color: '#8B5E3C', desc: 'Tonos calidos y piel perfecta' },
    { name: 'CINESTILL 800T', tag: 'NOCHE CINEMA', color: '#1a1a2e', desc: 'Atmosfera nocturna cinematografica' },
    { name: 'FUJI CLASSIC CHROME', tag: 'EDITORIAL', color: '#4a5568', desc: 'Colores desaturados y elegantes' },
    { name: 'TEAL & ORANGE', tag: 'HOLLYWOOD', color: '#0d4f4f', desc: 'Look de blockbuster americano' },
    { name: 'ILFORD HP5', tag: 'BLANCO Y NEGRO', color: '#2d2d2d', desc: 'Blanco y negro clasico atemporal' },
    { name: 'GOLDEN HOUR', tag: 'NATURAL', color: '#92400e', desc: 'Magia de la hora dorada' },
    { name: 'FILM NOIR', tag: 'DRAMATICO', color: '#111827', desc: 'Alto contraste, sombras profundas' },
    { name: 'ANAMORPHIC', tag: 'CINEMASCOPE', color: '#1e3a5f', desc: 'Lens flares y formato 2.39:1' },
  ];

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={s.screenHeader}>
        <Text style={s.screenTitle}>ESTILOS</Text>
        <Text style={s.screenSub}>PRESETS CINEMATOGRAFICOS</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.presetsGrid} showsVerticalScrollIndicator={false}>
        {presets.map((preset, i) => (
          <TouchableOpacity key={i} style={s.presetCard} activeOpacity={0.85}>
            <View style={[s.presetGradient, { backgroundColor: preset.color }]}>
              <View style={s.presetContent}>
                <View style={s.presetTag}>
                  <Text style={s.presetTagText}>{preset.tag}</Text>
                </View>
                <Text style={s.presetName}>{preset.name}</Text>
                <Text style={s.presetDesc}>{preset.desc}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function AcademyScreen() {
  const [expanded, setExpanded] = React.useState(0);

  const levels = [
    {
      level: '01', title: 'PRINCIPIANTE', subtitle: 'Las bases de la fotografia', progress: 75,
      lessons: [
        { title: 'Que es el ISO?', done: true, duration: '8 min' },
        { title: 'La apertura (f/)', done: true, duration: '10 min' },
        { title: 'Velocidad de obturacion', done: true, duration: '12 min' },
        { title: 'El triangulo de exposicion', done: false, duration: '15 min' },
        { title: 'Composicion: Regla de tercios', done: false, duration: '10 min' },
      ]
    },
    {
      level: '02', title: 'INTERMEDIO', subtitle: 'Domina la luz', progress: 0,
      lessons: [
        { title: 'Leer el histograma', done: false, duration: '12 min' },
        { title: 'Fotografia en RAW', done: false, duration: '18 min' },
        { title: 'Iluminacion natural', done: false, duration: '20 min' },
        { title: 'Retrato profesional', done: false, duration: '25 min' },
      ]
    },
    {
      level: '03', title: 'AVANZADO', subtitle: 'Tecnicas de elite', progress: 0,
      lessons: [
        { title: 'Larga exposicion', done: false, duration: '20 min' },
        { title: 'Fotografia nocturna', done: false, duration: '25 min' },
        { title: 'Light painting', done: false, duration: '15 min' },
        { title: 'Street photography', done: false, duration: '18 min' },
      ]
    },
  ];

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={s.screenHeader}>
        <Text style={s.screenTitle}>ACADEMIA</Text>
        <Text style={s.screenSub}>FORMA TU OJO PROFESIONAL</Text>
      </View>
      <View style={s.statsRow}>
        {[
          { icon: '★', value: '12', label: 'RETOS' },
          { icon: '◆', value: '840', label: 'XP' },
          { icon: '▲', value: '7', label: 'RACHA' },
          { icon: '●', value: '1', label: 'CERT' },
        ].map((stat, i) => (
          <View key={i} style={s.statItem}>
            <Text style={s.statIcon}>{stat.icon}</Text>
            <Text style={s.statValue}>{stat.value}</Text>
            <Text style={s.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {levels.map((level, i) => (
          <TouchableOpacity key={i} style={s.levelCard} onPress={() => setExpanded(expanded === i ? -1 : i)} activeOpacity={0.9}>
            <View style={s.levelHeader}>
              <View style={s.levelBadge}>
                <Text style={s.levelBadgeText}>{level.level}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.levelTitle}>{level.title}</Text>
                <Text style={s.levelSubtitle}>{level.subtitle}</Text>
              </View>
              <View style={s.levelRight}>
                {level.progress > 0 && <Text style={s.levelPercent}>{level.progress}%</Text>}
                <Ionicons name={expanded === i ? 'chevron-up' : 'chevron-down'} size={18} color={C.gray2} />
              </View>
            </View>
            {level.progress > 0 && (
              <View style={s.progressTrack}>
                <View style={[s.progressFill, { width: level.progress + '%' }]}/>
              </View>
            )}
            {expanded === i && (
              <View style={s.lessonsList}>
                {level.lessons.map((lesson, j) => (
                  <TouchableOpacity key={j} style={s.lessonItem}>
                    <View style={[s.lessonDot, lesson.done && s.lessonDotDone]}>
                      {lesson.done && <Ionicons name="checkmark" size={12} color={C.bg} />}
                    </View>
                    <Text style={[s.lessonTitle, lesson.done && { color: C.gray2 }]}>{lesson.title}</Text>
                    <Text style={s.lessonDuration}>{lesson.duration}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={s.challengeBtn}>
                  <Text style={s.challengeBtnText}>★ RETO DEL NIVEL</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function ProfileScreen() {
  const badges = ['◆','★','●','▲','■','◉','◈','◇'];

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={s.profileHeader}>
          <View style={s.avatar}>
            <Ionicons name="person" size={36} color={C.gold} />
          </View>
          <Text style={s.profileName}>MI PERFIL</Text>
          <View style={s.rankBadge}>
            <Text style={s.rankText}>✦ FOTOGRAFO ✦</Text>
          </View>
          <View style={s.profileStats}>
            {[
              { value: '247', label: 'FOTOS' },
              { value: '840', label: 'XP' },
              { value: 'LVL 2', label: 'NIVEL' },
              { value: '7', label: 'RACHA' },
            ].map((stat, i) => (
              <View key={i} style={s.profileStat}>
                <Text style={s.profileStatValue}>{stat.value}</Text>
                <Text style={s.profileStatLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>INSIGNIAS</Text>
          <View style={s.badgesGrid}>
            {badges.map((badge, i) => (
              <View key={i} style={[s.badgeItem, i >= 5 && { opacity: 0.3 }]}>
                <Text style={s.badgeEmoji}>{badge}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>MI PLAN</Text>
          <View style={s.planCard}>
            <View>
              <Text style={s.planName}>GRATIS</Text>
              <Text style={s.planDesc}>3 presets · 5 RAW/mes</Text>
            </View>
            <TouchableOpacity style={s.upgradeBtn}>
              <Text style={s.upgradeBtnText}>SUBIR A PRO</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>CONFIGURACION</Text>
          {[
            { icon: 'notifications-outline', label: 'Notificaciones' },
            { icon: 'globe-outline', label: 'Idioma' },
            { icon: 'save-outline', label: 'Almacenamiento' },
            { icon: 'help-circle-outline', label: 'Ayuda y soporte' },
            { icon: 'star-outline', label: 'Valorar VIPCAM' },
          ].map((opt, i) => (
            <TouchableOpacity key={i} style={s.optionItem}>
              <Ionicons name={opt.icon} size={20} color={C.gold} style={{ width: 28 }} />
              <Text style={s.optionLabel}>{opt.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={C.gray2} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: s.tabBar,
            tabBarActiveTintColor: C.gold,
            tabBarInactiveTintColor: C.gray2,
            tabBarLabelStyle: s.tabLabel,
            tabBarIcon: ({ color, size }) => {
              const icons = {
                Camara: 'camera',
                Estilos: 'color-palette-outline',
                Academia: 'school-outline',
                Perfil: 'person-outline',
              };
              return <Ionicons name={icons[route.name]} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Camara" component={CameraScreen} />
          <Tab.Screen name="Estilos" component={PresetsScreen} />
          <Tab.Screen name="Academia" component={AcademyScreen} />
          <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  viewfinder: { flex: 1, backgroundColor: '#111', justifyContent: 'space-between' },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: C.gold, zIndex: 10 },
  cornerTL: { top: 60, left: 20, borderTopWidth: 2, borderLeftWidth: 2 },
  cornerTR: { top: 60, right: 20, borderTopWidth: 2, borderRightWidth: 2 },
  cornerBL: { bottom: 320, left: 20, borderBottomWidth: 2, borderLeftWidth: 2 },
  cornerBR: { bottom: 320, right: 20, borderBottomWidth: 2, borderRightWidth: 2 },
  gridLine: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.12)' },
  hud: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 12,
    backgroundColor: 'rgba(8,8,8,0.85)',
  },
  logo: { color: C.gold, fontSize: 18, fontWeight: '800', letterSpacing: 6 },
  hudRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  hudBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center', alignItems: 'center',
  },
  rawBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
    borderWidth: 1, borderColor: C.goldBorder, backgroundColor: C.goldBg,
  },
  rawText: { color: C.gold, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  centerInfo: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerMode: { color: 'rgba(255,255,255,0.15)', fontSize: 48, fontWeight: '800', letterSpacing: 8 },
  centerSub: { color: 'rgba(255,255,255,0.2)', fontSize: 12, letterSpacing: 3, marginTop: 8 },
  bottomHud: { backgroundColor: 'rgba(8,8,8,0.92)', paddingTop: 8, paddingBottom: 8 },
  controlsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingVertical: 10, paddingHorizontal: 8,
  },
  ctrlItem: {
    alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10,
    borderRadius: 10, borderWidth: 1, borderColor: 'transparent', minWidth: 56,
  },
  ctrlItemActive: { backgroundColor: C.goldBg, borderColor: C.goldBorder },
  ctrlLabel: { color: C.gray2, fontSize: 10, letterSpacing: 1, marginBottom: 2 },
  ctrlValue: { color: C.white, fontSize: 12, fontWeight: '700' },
  ctrlValueActive: { color: C.gold },
  valPanel: { maxHeight: 50, marginBottom: 8 },
  valPanelContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  valChip: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  valChipActive: { backgroundColor: C.goldBg, borderColor: C.gold },
  valChipText: { color: C.gray1, fontSize: 13 },
  valChipTextActive: { color: C.gold, fontWeight: '700' },
  evPanel: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 8, gap: 16,
  },
  evBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center', alignItems: 'center',
  },
  evBtnText: { color: C.white, fontSize: 24 },
  evCenter: { flex: 1, alignItems: 'center', gap: 8 },
  evValue: { color: C.white, fontSize: 22, fontWeight: '700' },
  evTrack: { width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 },
  evFill: { height: '100%', backgroundColor: C.gold, borderRadius: 2 },
  captureRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 40, paddingVertical: 16,
  },
  galleryBtn: {
    width: 52, height: 52, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  shutterOuter: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.04)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  shutterRing: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 2.5, borderColor: C.gold,
    justifyContent: 'center', alignItems: 'center',
  },
  shutterCenter: { width: 58, height: 58, borderRadius: 29, backgroundColor: C.gold },
  flipBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center', alignItems: 'center',
  },
  modeRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 28,
    paddingVertical: 12, paddingBottom: 4,
  },
  modeItem: { alignItems: 'center', gap: 5 },
  modeText: { color: C.gray2, fontSize: 11, letterSpacing: 2, fontWeight: '600' },
  modeTextActive: { color: C.white },
  modeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.gold },

  presetsGrid: { padding: 16, gap: 12, paddingBottom: 100 },
  presetCard: { borderRadius: 16, overflow: 'hidden', height: 110 },
  presetGradient: { flex: 1, borderRadius: 16, padding: 16, justifyContent: 'flex-end' },
  presetContent: { gap: 4 },
  presetTag: {
    alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', marginBottom: 4,
  },
  presetTagText: { color: 'rgba(255,255,255,0.7)', fontSize: 9, letterSpacing: 2 },
  presetName: { color: C.white, fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  presetDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },

  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingVertical: 16, paddingHorizontal: 8,
    borderBottomWidth: 1, borderBottomColor: C.bg3,
  },
  statItem: { alignItems: 'center', gap: 4 },
  statIcon: { fontSize: 20, color: C.gold },
  statValue: { color: C.white, fontSize: 16, fontWeight: '800' },
  statLabel: { color: C.gray2, fontSize: 9, letterSpacing: 2 },
  levelCard: {
    backgroundColor: C.bg2, borderRadius: 16, marginBottom: 12,
    padding: 16, borderWidth: 1, borderColor: C.bg3,
  },
  levelHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  levelBadge: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: C.goldBg, borderWidth: 1, borderColor: C.goldBorder,
    justifyContent: 'center', alignItems: 'center',
  },
  levelBadgeText: { color: C.gold, fontSize: 13, fontWeight: '800' },
  levelTitle: { color: C.white, fontSize: 15, fontWeight: '700', letterSpacing: 1 },
  levelSubtitle: { color: C.gray2, fontSize: 12, marginTop: 2 },
  levelRight: { alignItems: 'flex-end', gap: 4 },
  levelPercent: { color: C.gold, fontSize: 12, fontWeight: '700' },
  progressTrack: { height: 3, backgroundColor: C.bg4, borderRadius: 2, marginTop: 12, marginBottom: 4 },
  progressFill: { height: '100%', backgroundColor: C.gold, borderRadius: 2 },
  lessonsList: { marginTop: 16, gap: 2 },
  lessonItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.bg4,
  },
  lessonDot: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.5, borderColor: C.gray3,
    justifyContent: 'center', alignItems: 'center',
  },
  lessonDotDone: { backgroundColor: C.gold, borderColor: C.gold },
  lessonTitle: { flex: 1, color: C.white, fontSize: 14 },
  lessonDuration: { color: C.gray2, fontSize: 11, fontWeight: '600' },
  challengeBtn: {
    marginTop: 12, paddingVertical: 12, borderRadius: 12,
    backgroundColor: C.goldBg, borderWidth: 1, borderColor: C.goldBorder,
    alignItems: 'center',
  },
  challengeBtnText: { color: C.gold, fontSize: 13, fontWeight: '800', letterSpacing: 2 },

  profileHeader: {
    alignItems: 'center', paddingTop: 60, paddingBottom: 24,
    borderBottomWidth: 1, borderBottomColor: C.bg3, backgroundColor: C.bg2,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: C.goldBg, borderWidth: 2, borderColor: C.gold,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  profileName: { color: C.white, fontSize: 20, fontWeight: '800', letterSpacing: 4, marginBottom: 8 },
  rankBadge: {
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20,
    backgroundColor: C.goldBg, borderWidth: 1, borderColor: C.goldBorder, marginBottom: 20,
  },
  rankText: { color: C.gold, fontSize: 11, fontWeight: '700', letterSpacing: 3 },
  profileStats: { flexDirection: 'row', gap: 24, paddingHorizontal: 20 },
  profileStat: { alignItems: 'center', gap: 4 },
  profileStatValue: { color: C.white, fontSize: 20, fontWeight: '800' },
  profileStatLabel: { color: C.gray2, fontSize: 9, letterSpacing: 2 },
  section: { padding: 16 },
  sectionTitle: { color: C.gray2, fontSize: 11, letterSpacing: 3, fontWeight: '700', marginBottom: 12 },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeItem: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: C.bg2, borderWidth: 1, borderColor: C.bg4,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeEmoji: { fontSize: 22, color: C.gold },
  planCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderRadius: 14, backgroundColor: C.bg2,
    borderWidth: 1, borderColor: C.bg3,
  },
  planName: { color: C.white, fontSize: 16, fontWeight: '800' },
  planDesc: { color: C.gray2, fontSize: 12, marginTop: 2 },
  upgradeBtn: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    backgroundColor: C.gold,
  },
  upgradeBtnText: { color: C.bg, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  optionItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.bg3,
  },
  optionLabel: { flex: 1, color: C.white, fontSize: 15 },

  tabBar: {
    backgroundColor: 'rgba(8,8,8,0.97)',
    borderTopWidth: 1, borderTopColor: '#1A1A1A',
    height: 80, paddingBottom: 20,
  },
  tabLabel: { fontSize: 9, letterSpacing: 1.5, fontWeight: '700' },

  screenHeader: {
    paddingTop: 52, paddingBottom: 16, paddingHorizontal: 20,
    backgroundColor: C.bg2, borderBottomWidth: 1, borderBottomColor: C.bg3,
  },
  screenTitle: { color: C.white, fontSize: 28, fontWeight: '800', letterSpacing: 6 },
  screenSub: { color: C.gold, fontSize: 11, letterSpacing: 3, fontWeight: '600', marginTop: 4 },
});
