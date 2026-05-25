const fs = require('fs');

const content = fs.readFileSync('src/app/index.tsx', 'utf8');
const lines = content.split('\n');

// Find the line where "Omitir por ahora" is
let skipIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Omitir por ahora')) {
    skipIndex = i;
    break; // get the first occurrence
  }
}

// Find the footer Banner
let footerIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('footerBanner: {')) {
    footerIndex = i;
    break;
  }
}

// Rebuild the file
const newLines = lines.slice(0, skipIndex + 2); // Include "Omitir por ahora" and </TouchableOpacity>
newLines.push(
  '              </View>',
  '            )}',
  '          </Animated.View>',
  '        </ScrollView>',
  '      </KeyboardAvoidingView>',
  '      )}',
  '',
  '      {/* Footer */}',
  '      <View style={styles.footerBanner}>',
  '        <MaterialIcons name="local-police" size={24} color="#006b47" />',
  '        <Text style={styles.footerText}>',
  '          Tus datos están encriptados de extremo a extremo y protegidos por leyes de privacidad.',
  '        </Text>',
  '      </View>',
  '',
  '      {/* Success Overlay Modal */}',
  '      {showSuccess && (',
  '        <View style={styles.successOverlay}>',
  '          <View style={styles.successCard}>',
  '            <View style={styles.successIconWrapper}>',
  '              <MaterialIcons name="check-circle" size={64} color="#006b47" />',
  '            </View>',
  '            <Text style={styles.successTitle}>¡Cuenta Creada!</Text>',
  '            <Text style={styles.successDesc}>',
  '              Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión con tu correo y contraseña.',
  '            </Text>',
  '            <TouchableOpacity',
  '              style={styles.successButton}',
  '              onPress={() => {',
  '                setShowSuccess(false);',
  '                switchMode("login");',
  '              }}',
  '            >',
  '              <Text style={styles.successButtonText}>Ir al Inicio de Sesión</Text>',
  '              <MaterialIcons name="arrow-forward" size={18} color="#fff" />',
  '            </TouchableOpacity>',
  '          </View>',
  '        </View>',
  '      )}',
  '    </SafeAreaView>',
  '  );',
  '}',
  ''
);

// find where StyleSheet.create starts
let styleStartIndex = -1;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('const styles = StyleSheet.create({')) {
    styleStartIndex = i;
    break;
  }
}

// Append styles from styleStartIndex to the end
newLines.push(...lines.slice(styleStartIndex));

fs.writeFileSync('src/app/index.tsx', newLines.join('\n'));
console.log('Fixed index.tsx');
