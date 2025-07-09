import { Document, Page, Text, View, StyleSheet, Svg, Polygon } from '@react-pdf/renderer';

function renderBoldText(text: string) {
  // Split by ** and alternate between normal and bold
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, idx) =>
    idx % 2 === 1 ? (
      <Text key={idx} style={{ fontWeight: 'bold', color: '#1f2937' }}>{part}</Text>
    ) : (
      <Text key={idx}>{part}</Text>
    )
  );
}

function getHexagonPointsRIASEC(
    scores: Record<string, number>,
    maxScore = 50,
    radius = 120,
    cx = 200,
    cy = 170
  ) {
    const categories = [
      { key: 'R', angle: -90 },
      { key: 'I', angle: -30 },
      { key: 'A', angle: 30 },
      { key: 'S', angle: 90 },
      { key: 'E', angle: 150 },
      { key: 'C', angle: 210 }
    ];
    return categories.map(cat => {
      const value = scores[cat.key] ?? 0;
      const normalized = Math.min(value / maxScore, 1);
      const dist = normalized * radius;
      const x = cx + Math.cos((cat.angle - 90) * Math.PI / 180) * dist;
      const y = cy + Math.sin((cat.angle - 90) * Math.PI / 180) * dist;
      return `${x},${y}`;
    }).join(' ');
  }
  
  function getHexagonOutlinePoints(radius = 120, cx = 200, cy = 170) {
    const categories = [
      { angle: -90 },
      { angle: -30 },
      { angle: 30 },
      { angle: 90 },
      { angle: 150 },
      { angle: 210 }
    ];
    return categories.map(cat => {
      const x = cx + Math.cos((cat.angle - 90) * Math.PI / 180) * radius;
      const y = cy + Math.sin((cat.angle - 90) * Math.PI / 180) * radius;
      return `${x},${y}`;
    }).join(' ');
  }
  
  // PDF Styles
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: 20,
      fontSize: 10,
    },
    header: {
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      paddingBottom: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 14,
      color: '#6b7280',
      marginBottom: 5,
      textAlign: 'center',
    },
    section: {
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#1f2937',
    },
    subsectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#374151',
    },
    description: {
      fontSize: 9,
      lineHeight: 1.4,
      marginBottom: 10,
      textAlign: 'justify',
    },
    scoreText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#667eea',
      marginBottom: 5,
    },
    riasecItem: {
      marginBottom: 12,
      paddingBottom: 8,
      borderBottomWidth: 0.5,
      borderBottomColor: '#e5e7eb',
    },
    riasecTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#1f2937',
    },
    riasecDescription: {
      fontSize: 9,
      lineHeight: 1.3,
      marginBottom: 5,
      textAlign: 'justify',
    },
    professionsList: {
      fontSize: 9,
      fontStyle: 'italic',
      color: '#6b7280',
    },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      paddingVertical: 6,
    },
    testName: {
      width: '70%',
      fontSize: 10,
    },
    testScore: {
      width: '30%',
      fontSize: 10,
      textAlign: 'right',
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 30,
      right: 30,
      textAlign: 'center',
      color: '#9ca3af',
      fontSize: 10,
    },
    careerSection: {
      marginBottom: 12,
      paddingBottom: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: '#e5e7eb',
    },
    careerTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#1f2937',
    },
    careerSubtitle: {
      fontSize: 10,
      fontWeight: 'bold',
      marginBottom: 3,
      color: '#4b5563',
    },
    careerText: {
      fontSize: 9,
      lineHeight: 1.3,
      marginBottom: 5,
      textAlign: 'justify',
    },
    // New styles for improved tables
    tableContainer: {
      marginTop: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      borderRadius: 8,
    },
    tableHeader: {
      backgroundColor: '#f3f4f6',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderBottomWidth: 2,
      borderBottomColor: '#d1d5db',
    },
    tableHeaderText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#1f2937',
      textAlign: 'center',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    tableRowLast: {
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    tableCellField: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#1f2937',
      textAlign: 'left',
      paddingRight: 8,
    },
    tableCellReason: {
      fontSize: 9,
      color: '#4b5563',
      textAlign: 'justify',
      lineHeight: 1.4,
    },
    // University recommendations table styles
    universityTableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    universityTableRowLast: {
      flexDirection: 'row',
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    universityTableCellField: {
      width: '25%',
      fontSize: 10,
      fontWeight: 'bold',
      color: '#1f2937',
      textAlign: 'left',
      paddingRight: 8,
    },
    universityTableCell: {
      width: '25%',
      fontSize: 9,
      color: '#4b5563',
      textAlign: 'left',
      paddingRight: 8,
      lineHeight: 1.3,
    },
    universityTableHeaderRow: {
      flexDirection: 'row',
      backgroundColor: '#f3f4f6',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderBottomWidth: 2,
      borderBottomColor: '#d1d5db',
    },
    universityTableHeaderCell: {
      width: '25%',
      fontSize: 10,
      fontWeight: 'bold',
      color: '#1f2937',
      textAlign: 'center',
      paddingRight: 8,
    },
  });

  export interface ScoreReportProps {
    userData: any;
    skills: {
      verbal?: number;
      abstracto?: number;
      numerico?: number;
      mecanico?: number;
      espacial?: number;
    };
    preferences: {
      Realista?: number;
      Investigador?: number;
      Artistico?: number;
      Social?: number;
      emprendedor?: number;
      Convencional?: number;
    };
    recommendations: Array<{ "Campo de Estudio": string; Compatibilidad:number; Razon: string; }>;
    universityRecommendations: Array<{
      "Campo de Estudio": string;
      "Recomendacion Uno": string;
      "Recomendacion Dos": string;
      "Recomendacion Tres": string;
    }>;
    suggestedCareers?: {
      name: string;
      compatibility: number;
      justification: string;
      fieldOfAction: string;
      keySubjects: string[];
      similarCareers: string[];
      workEnvironments: string[];
    }[];
  }
  
  const ScoreReport = ({ userData, skills, preferences, suggestedCareers, recommendations, universityRecommendations }: ScoreReportProps) => {
    // Find the RIASEC scores
    const cognitiveScores = {
      verbal: skills?.verbal ?? 0,
      abstracto: skills?.abstracto ?? 0,
      numerico: skills?.numerico ?? 0,
      mecanico: skills?.mecanico ?? 0,
      espacial: skills?.espacial ?? 0,
    };
    
    const riasecScores = {
      R: preferences?.Realista ?? 0,
      I: preferences?.Investigador ?? 0,
      A: preferences?.Artistico ?? 0,
      S: preferences?.Social ?? 0,
      E: preferences?.emprendedor ?? 0,
      C: preferences?.Convencional ?? 0,
    };
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>REPORTE VOCACIONAL</Text>
            <Text style={styles.subtitle}>{userData.name}</Text>
            <Text style={styles.subtitle}>{userData.email}</Text>
            {userData.title && <Text style={styles.subtitle}>{userData.title} - {userData.company || 'N/A'}</Text>}
          </View>
          
          {/* Cognitive Abilities Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Habilidades Cognitivas</Text>
            
            <View style={styles.riasecItem}>
              <Text style={styles.scoreText}>Verbal - {cognitiveScores.verbal}%</Text>
              <Text style={styles.description}>
                Se mide la capacidad del estudiante para comprender y relacionar conceptos usando el lenguaje. 
                Ayuda a identificar qué tan bien puede pensar de forma lógica y generalizar ideas. Es útil para saber 
                si el estudiante tiene buen potencial en áreas donde se necesita entender relaciones verbales complejas.
              </Text>
            </View>

            <View style={styles.riasecItem}>
              <Text style={styles.scoreText}>Abstracto - {cognitiveScores.abstracto}%</Text>
              <Text style={styles.description}>
                Se evalúa la capacidad del estudiante para razonar usando figuras, sin depender de palabras o números. 
                El estudiante debe identificar patrones y elegir la figura que sigue lógicamente en una secuencia. 
                Es útil para saber si tiene facilidad para entender relaciones visuales, algo importante en carreras 
                que requieren pensamiento abstracto o trabajo con formas, espacios y objetos.
              </Text>
            </View>

            <View style={styles.riasecItem}>
              <Text style={styles.scoreText}>Numérico - {cognitiveScores.numerico}%</Text>
              <Text style={styles.description}>
                Este test mide la habilidad del estudiante para razonar con números, más que su rapidez para hacer cálculos. 
                Los ejercicios están diseñados para enfocarse en el pensamiento lógico-matemático, usando operaciones 
                sencillas que ya conoce. Es útil para identificar su potencial en áreas que requieren razonamiento numérico.
              </Text>
            </View>

            <View style={styles.riasecItem}>
              <Text style={styles.scoreText}>Mecánico - {cognitiveScores.mecanico}%</Text>
              <Text style={styles.description}>
                Este test evalúa qué tan bien el estudiante comprende cómo funcionan las máquinas, herramientas y movimientos. 
                Es útil para saber si tiene habilidades en áreas técnicas como mecánica, electricidad, carpintería o ingeniería.
              </Text>
            </View>

            <View style={styles.riasecItem}>
              <Text style={styles.scoreText}>Espacial - {cognitiveScores.espacial}%</Text>
              <Text style={styles.description}>
                Se mide la capacidad del estudiante para imaginar y manipular objetos en el espacio, como girarlos o 
                ver cómo encajan. Es útil para identificar habilidades en áreas como arquitectura, diseño, ingeniería, 
                dibujo técnico o actividades que requieren buena orientación visual y espacial.
              </Text>
            </View>
          </View>
        </Page>

        <Page size="A4" style={styles.page}>
          {/* RIASEC Personality Test Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Test de Personalidad RIASEC</Text>
            
            <Text style={styles.description}>
              El modelo RIASEC, desarrollado por el psicólogo John Holland, es una de las teorías más reconocidas 
              y utilizadas a nivel mundial para ayudar a las personas a descubrir sus intereses vocacionales y 
              tomar decisiones educativas y profesionales más acertadas.
            </Text>

            <Text style={styles.description}>
              Este modelo parte de la idea de que las personas y los entornos laborales pueden agruparse en seis 
              tipos generales: Realista, Investigativo, Artístico, Social, Emprendedor y Convencional. Cada persona 
              tiene una combinación única de estos intereses, y al conocerlos, puede encontrar caminos profesionales 
              que se alineen mejor con su forma de ser, sus talentos y su motivación interna.
            </Text>

            <View style={styles.riasecItem}>
              <Text style={styles.riasecTitle}>R - Realistic (Realista) - {riasecScores.R}%</Text>
              <Text style={styles.riasecDescription}>
                Personas que disfrutan trabajar con las manos, con herramientas, máquinas, animales o en espacios 
                al aire libre. Prefieren actividades físicas, técnicas o mecánicas antes que tareas sociales o abstractas. 
                Suelen ser prácticas, directas, y valoran los resultados concretos.
              </Text>
              <Text style={styles.professionsList}>
                Profesiones afines: ingeniero, técnico automotriz, electricista, piloto, agricultor, chef, constructor.
              </Text>
            </View>

            <View style={styles.riasecItem}>
              <Text style={styles.riasecTitle}>I - Investigative (Investigativo) - {riasecScores.I}%</Text>
              <Text style={styles.riasecDescription}>
                Personas curiosas, analíticas y reflexivas. Les interesa entender cómo funcionan las cosas, resolver 
                problemas, investigar y trabajar con teorías o datos. Disfrutan del estudio, la observación y el 
                pensamiento crítico. Prefieren los desafíos intelectuales por encima de las relaciones sociales.
              </Text>
              <Text style={styles.professionsList}>
                Profesiones afines: científico, médico, ingeniero biomédico, biólogo, economista, programador, matemático.
              </Text>
            </View>

            <View style={styles.riasecItem}>
              <Text style={styles.riasecTitle}>A - Artistic (Artístico) - {riasecScores.A}%</Text>
              <Text style={styles.riasecDescription}>
                Personas creativas, expresivas y originales. Les gusta crear, innovar, experimentar con ideas, 
                emociones o formas visuales y sonoras. Prefieren ambientes flexibles, sin rutinas estrictas, 
                y valoran la libertad para expresarse.
              </Text>
              <Text style={styles.professionsList}>
                Profesiones afines: diseñador gráfico, actor, arquitecto, músico, escritor, publicista, cineasta.
              </Text>
            </View>

            <View style={styles.riasecItem}>
              <Text style={styles.riasecTitle}>S - Social (Social) - {riasecScores.S}%</Text>
              <Text style={styles.riasecDescription}>
                Personas empáticas, comunicativas y cooperativas. Disfrutan interactuar con otros, enseñar, 
                acompañar, ayudar o cuidar. Se sienten cómodas en entornos colaborativos y suelen ser buenos 
                mediadores, orientadores o guías.
              </Text>
              <Text style={styles.professionsList}>
                Profesiones afines: psicólogo, maestro, enfermero, terapeuta, trabajador social, orientador educativo.
              </Text>
            </View>

            <View style={styles.riasecItem}>
              <Text style={styles.riasecTitle}>E - Enterprising (Emprendedor) - {riasecScores.E}%</Text>
              <Text style={styles.riasecDescription}>
                Personas que disfrutan liderar, persuadir, tomar decisiones y asumir riesgos. Tienen iniciativa, 
                confianza en sí mismas y se sienten cómodas organizando proyectos o dirigiendo a otros. Les interesa 
                el mundo de los negocios, las ventas, la política o el derecho.
              </Text>
              <Text style={styles.professionsList}>
                Profesiones afines: empresario, abogado, gerente, político, vendedor, consultor, director comercial.
              </Text>
            </View>

            <View style={styles.riasecItem}>
              <Text style={styles.riasecTitle}>C - Conventional (Convencional) - {riasecScores.C}%</Text>
              <Text style={styles.riasecDescription}>
                Personas organizadas, meticulosas y responsables. Les gusta trabajar con estructuras claras, 
                seguir procedimientos y manejar información o datos de forma sistemática. Son eficientes, 
                detallistas y prefieren ambientes ordenados y predecibles.
              </Text>
              <Text style={styles.professionsList}>
                Profesiones afines: contador, administrador, analista financiero, asistente ejecutivo, archivista, auditor.
              </Text>
            </View>
          </View>
        </Page>

        {/* Suggested Careers Section */}
        {suggestedCareers && suggestedCareers.length > 0 && (
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Carreras Sugeridas</Text>
              
              {suggestedCareers.map((career, index) => (
                <View key={index} style={styles.careerSection}>
                  <Text style={styles.careerTitle}>
                    Carrera sugerida {index + 1}: {career.name} - {career.compatibility}% compatibilidad
                  </Text>
                  
                  <Text style={styles.careerSubtitle}>Justificación:</Text>
                  <Text style={styles.careerText}>{career.justification}</Text>
                  
                  <Text style={styles.careerSubtitle}>Campo de acción de la carrera:</Text>
                  <Text style={styles.careerText}>{career.fieldOfAction}</Text>
                  
                  {career.keySubjects && career.keySubjects.length > 0 && (
                    <>
                      <Text style={styles.careerSubtitle}>Materias clave de la carrera:</Text>
                      <Text style={styles.careerText}>{career.keySubjects.join(', ')}</Text>
                    </>
                  )}
                  
                  {career.similarCareers && career.similarCareers.length > 0 && (
                    <>
                      <Text style={styles.careerSubtitle}>Carreras similares con componentes innovadores:</Text>
                      <Text style={styles.careerText}>{career.similarCareers.join(', ')}</Text>
                    </>
                  )}
                  
                  {career.workEnvironments && career.workEnvironments.length > 0 && (
                    <>
                      <Text style={styles.careerSubtitle}>Ámbitos laborales típicos:</Text>
                      <Text style={styles.careerText}>{career.workEnvironments.join(', ')}</Text>
                    </>
                  )}
                </View>
              ))}
            </View>
          </Page>
        )}

        {/* RIASEC Hexagon Chart - Final Page */}
        <Page size="A4" style={styles.page}>
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
              Perfil RIASEC - Representación Visual
            </Text>
            
            {/* Container for SVG and labels */}
            <View style={{ position: 'relative', width: 400, height: 340 }}>
              <Svg width="400" height="340" viewBox="0 0 400 340">
                {/* Hexagon outline */}
                <Polygon
                  points={getHexagonOutlinePoints(120, 200, 170)}
                  stroke="#ccc"
                  strokeWidth={2}
                  fill="none"
                />
                {/* Data polygon */}
                <Polygon
                  points={getHexagonPointsRIASEC(riasecScores, 50, 120, 200, 170)}
                  fill="rgba(102,126,234,0.3)"
                  stroke="#667eea"
                  strokeWidth={3}
                />
              </Svg>
              
              {/* Labels positioned around the hexagon */}
              <Text style={{ position: 'absolute', left: 175, top: 20, fontSize: 12, fontWeight: 'bold', textAlign: 'center', width: 50 }}>
                Realista
              </Text>
              <Text style={{ position: 'absolute', left: 310, top: 80, fontSize: 12, fontWeight: 'bold', textAlign: 'center', width: 50 }}>
                Investigativo
              </Text>
              <Text style={{ position: 'absolute', left: 310, top: 230, fontSize: 12, fontWeight: 'bold', textAlign: 'center', width: 50 }}>
                Artístico
              </Text>
              <Text style={{ position: 'absolute', left: 175, top: 290, fontSize: 12, fontWeight: 'bold', textAlign: 'center', width: 50 }}>
                Social
              </Text>
              <Text style={{ position: 'absolute', left: 40, top: 230, fontSize: 12, fontWeight: 'bold', textAlign: 'center', width: 50 }}>
                Emprendedor
              </Text>
              <Text style={{ position: 'absolute', left: 40, top: 80, fontSize: 12, fontWeight: 'bold', textAlign: 'center', width: 50 }}>
                Convencional
              </Text>

              {/* Value labels */}
              {([
                { key: 'R', angle: -90, offsetX: 0, offsetY: -15 },
                { key: 'I', angle: -30, offsetX: 15, offsetY: -5 },
                { key: 'A', angle: 30, offsetX: 15, offsetY: 5 },
                { key: 'S', angle: 90, offsetX: 0, offsetY: 15 },
                { key: 'E', angle: 150, offsetX: -15, offsetY: 5 },
                { key: 'C', angle: 210, offsetX: -15, offsetY: -5 }
              ] as { key: keyof typeof riasecScores; angle: number; offsetX: number; offsetY: number }[]).map(cat => {
                const value = riasecScores[cat.key] ?? 0;
                if (value === 0) return null;
                
                const normalized = Math.min(value / 50, 1);
                const dist = normalized * 120;
                const x = 200 + Math.cos((cat.angle - 90) * Math.PI / 180) * dist + cat.offsetX;
                const y = 170 + Math.sin((cat.angle - 90) * Math.PI / 180) * dist + cat.offsetY;
                
                return (
                  <Text
                    key={cat.key}
                    style={{
                      position: 'absolute',
                      left: x - 10,
                      top: y - 8,
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: '#667eea',
                      textAlign: 'center',
                      width: 20
                    }}
                  >
                    {value}
                  </Text>
                );
              })}
            </View>

            {/* Scores summary below the hexagon */}
            <View style={{ marginTop: 30, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, width: '100%', textAlign: 'center' }}>
                Resumen de Puntuaciones RIASEC
              </Text>
              {Object.entries(riasecScores).map(([key, value]) => (
                <View key={key} style={{ width: '50%', marginBottom: 5 }}>
                  <Text style={{ fontSize: 12, textAlign: 'center' }}>
                    {key === 'R' ? 'Realista' : 
                     key === 'I' ? 'Investigativo' : 
                     key === 'A' ? 'Artístico' : 
                     key === 'S' ? 'Social' : 
                     key === 'E' ? 'Emprendedor' : 'Convencional'}: {value}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
          </Page>
          <Page size="A4" style={styles.page}>
          <View style={styles.tableContainer}>
  <View style={styles.tableHeader}>
    <Text style={styles.tableHeaderText}>Recomendaciones de Carrera</Text>
  </View>
  {/* Table header row */}
  <View style={styles.tableRow}>
    <View style={{ width: '30%' }}>
      <Text style={styles.tableCellField}>Campo de Estudio</Text>
    </View>
    <View style={{ width: '15%' }}>
      <Text style={styles.tableCellField}>Compatibilidad</Text>
    </View>
    <View style={{ width: '55%' }}>
      <Text style={styles.tableCellField}>Razón</Text>
    </View>
  </View>
  {/* Table body */}
  {recommendations.map((item, idx) => (
    <View key={idx} style={idx === recommendations.length - 1 ? styles.tableRowLast : styles.tableRow}>
      <View style={{ width: '30%' }}>
        <Text style={styles.tableCellField}>{item["Campo de Estudio"]}</Text>
      </View>
      <View style={{ width: '15%' }}>
        <Text style={styles.tableCellField}>{item.Compatibilidad}%</Text>
      </View>
      <View style={{ width: '55%' }}>
        <Text style={styles.tableCellReason}>
          {renderBoldText(item["Razon"])}
        </Text>
      </View>
    </View>
  ))}
</View>
          </Page>
          <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Programas recomendados</Text>
          {/* Improved University Recommendations Table */}
          {universityRecommendations && universityRecommendations.length > 0 && (
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Recomendaciones de Universidad</Text>
              </View>
              <View style={styles.universityTableHeaderRow}>
                <Text style={styles.universityTableHeaderCell}>Campo de Estudio</Text>
                <Text style={styles.universityTableHeaderCell}>Recomendación 1</Text>
                <Text style={styles.universityTableHeaderCell}>Recomendación 2</Text>
                <Text style={styles.universityTableHeaderCell}>Recomendación 3</Text>
              </View>
              {universityRecommendations.map((item, idx) => (
                <View key={idx} style={idx === universityRecommendations.length - 1 ? styles.universityTableRowLast : styles.universityTableRow}>
                  <Text style={styles.universityTableCellField}>{item["Campo de Estudio"]}</Text>
                  <Text style={styles.universityTableCell}>{item["Recomendacion Uno"]}</Text>
                  <Text style={styles.universityTableCell}>{item["Recomendacion Dos"]}</Text>
                  <Text style={styles.universityTableCell}>{item["Recomendacion Tres"]}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        </Page>
      </Document>
    );
  };
  
export default ScoreReport;