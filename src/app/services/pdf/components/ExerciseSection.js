import { View, Text, Image } from '@react-pdf/renderer';
import styles from '../styles';

export const ExerciseSection = ({ exercises }) => {
  if (!exercises || exercises.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Programme d'exercices</Text>
      {exercises.map((exerciseProgram, index) => (
        <View key={index} style={styles.listItem}>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>{exerciseProgram.exercise.name}</Text>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              {exerciseProgram.sets > 0 && (
                <Text style={styles.itemDetail}>
                  {exerciseProgram.sets} séries
                </Text>
              )}
              {exerciseProgram.reps > 0 && (
                <Text style={[styles.itemDetail, { marginLeft: 10 }]}>
                  {exerciseProgram.reps} répétitions
                </Text>
              )}
              {exerciseProgram.duration > 0 && (
                <Text style={[styles.itemDetail, { marginLeft: 10 }]}>
                  {exerciseProgram.duration} minutes
                </Text>
              )}
            </View>
            {exerciseProgram.exercise.description && (
              <Text style={[styles.itemDetail, { marginTop: 5 }]}>
                {exerciseProgram.exercise.description}
              </Text>
            )}
            {exerciseProgram.notes && (
              <Text style={[styles.note, { marginTop: 5 }]}>
                Note: {exerciseProgram.notes}
              </Text>
            )}
          </View>
          {exerciseProgram.exercise.imageUrl && exerciseProgram.exercise.imageUrl !== '' && (
            <Image
              src={exerciseProgram.exercise.imageUrl}
              style={styles.exerciseImage}
            />
          )}
        </View>
      ))}
      <Text style={styles.note}>
        Important: Effectuez les exercices en respectant la technique appropriée. 
        En cas de douleur, arrêtez immédiatement et consultez votre professionnel de santé.
      </Text>
    </View>
  );
};
