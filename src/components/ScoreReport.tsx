import { Document, Page, Text, View, StyleSheet, Svg, Polygon } from '@react-pdf/renderer';

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
      padding: 30,
    },
    header: {
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      paddingBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: '#6b7280',
      marginBottom: 5,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      paddingVertical: 8,
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
    completionInfo: {
      marginTop: 15,
      fontSize: 12,
      color: '#6b7280',
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
    hexagonContainer: {
      marginTop: 30,
      alignItems: 'center',
    },
    hexagonTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
    },
    scoresContainer: {
      marginTop: 20,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    scoreItem: {
      fontSize: 10,
      margin: 3,
      width: '45%',
    },
  });

  export interface ScoreReportProps {
    userData: {
      name: string;
      email: string;
      title?: string;
      company?: string;
      location?: string;
      bio?: string;
      phone?: string;
    };
    tests: {
      id: number;
      name: string;
      label: string;
      url: string;
      score?: number;
      status?: "completed" | "pending";
      hideInTable?: boolean;
    }[];
    completedTests: number;
  }
  
  const ScoreReport = ({ userData, tests }: ScoreReportProps) => {
    // Find the RIASEC scores
    const riasecScores = {
      R: tests.find(t => t.name === "Realista")?.score ?? 0,
      I: tests.find(t => t.name === "Investigativo")?.score ?? 0,
      A: tests.find(t => t.name === "Artistico" || t.name === "Artístico")?.score ?? 0,
      S: tests.find(t => t.name === "Social")?.score ?? 0,
      E: tests.find(t => t.name === "Emprendedor" || t.name === "Emprendedora")?.score ?? 0,
      C: tests.find(t => t.name === "Convencional")?.score ?? 0,
    };
  
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Reporte de Tests</Text>
            <Text style={styles.subtitle}>{userData.name} ({userData.email})</Text>
            {userData.title && <Text style={styles.subtitle}>{userData.title} at {userData.company || 'N/A'}</Text>}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resultados</Text>
            
            <View style={styles.row}>
              <Text style={[styles.testName, { fontWeight: 'bold' }]}>Nombre del test</Text>
              <Text style={[styles.testScore, { fontWeight: 'bold' }]}>Puntaje</Text>
            </View>
            
              {tests
                .filter(test => !test.hideInTable && test.name !== "Realista")
                .map((test) => (
                <View key={test.id} style={styles.row}>
                  <Text style={styles.testName}>{test.label}</Text>
                  <Text style={styles.testScore}>
                  {test.status === "completed" ? `${test.score}%` : "Pending"}
                  </Text>
                </View>
              ))}
            
            
            {riasecScores && (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>Perfil RIASEC</Text>
      
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
        <Text style={{ position: 'absolute', left: 175, top: 20, fontSize: 10, fontWeight: 'bold', textAlign: 'center', width: 50 }}>
          Realista
        </Text>
        <Text style={{ position: 'absolute', left: 310, top: 80, fontSize: 10, fontWeight: 'bold', textAlign: 'center', width: 50 }}>
          Investigativo
        </Text>
        <Text style={{ position: 'absolute', left: 310, top: 230, fontSize: 10, fontWeight: 'bold', textAlign: 'center', width: 50 }}>
          Artístico
        </Text>
        <Text style={{ position: 'absolute', left: 175, top: 290, fontSize: 10, fontWeight: 'bold', textAlign: 'center', width: 50 }}>
          Social
        </Text>
        <Text style={{ position: 'absolute', left: 40, top: 230, fontSize: 10, fontWeight: 'bold', textAlign: 'center', width: 50 }}>
          Emprendedor
        </Text>
        <Text style={{ position: 'absolute', left: 40, top: 80, fontSize: 10, fontWeight: 'bold', textAlign: 'center', width: 50 }}>
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
                fontSize: 10,
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
      <View style={{ marginTop: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.entries(riasecScores).map(([key, value]) => (
          <Text key={key} style={{ fontSize: 10, margin: 5, width: '30%', textAlign: 'center' }}>
            {key}: {value}
          </Text>
        ))}
      </View>
    </View>
  )}
          </View>
          
          <View style={styles.footer}>
            <Text>Reporte generado {new Date().toLocaleDateString()}</Text>
          </View>
        </Page>
      </Document>
    );
  };
  
export default ScoreReport;