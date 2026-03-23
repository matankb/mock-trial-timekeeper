import { StyleSheet } from 'react-native';
import { FC } from 'react';
import Text from '../../Text';
import { Trial } from '../../../controllers/trial';
import { League } from '../../../constants/leagues';

interface TimeSummaryExplanationProps {
  trial: Trial;
}

function getExplanation(trial: Trial) {
  const { stage, setup, league } = trial;

  // Independent reexaminations
  if (setup.reexaminationsIndependent) {
    if (stage.includes('redirect')) {
      return 'Redirect examinations do not count against the time for direct examinations.';
    } else if (stage.includes('recross')) {
      return 'Recross examinations do not count against the total time for cross examinations.';
    }
  }

  if (league === League.Idaho && stage === 'joint.prep.closings') {
    return 'Preparation for closings does not count against your time for closing arguments. If teams decide to not use this time, you can skip directly to the next stage.';
  }

  const isDisputeStage =
    (league === League.CNMI && stage.startsWith('joint.cnmi.dispute')) ||
    (league === League.Arizona && stage.startsWith('joint.national.dispute')) ||
    (league === League.NorthDakota &&
      stage.startsWith('joint.national.dispute'));

  if (isDisputeStage) {
    return 'Teams may consult with their coach to determine whether they wish to file a dispute alleging a substantial rules violation. If neither team files a dispute, the trial is over.';
  }
}

/**
 * A few leagues have text explaining different time summary rules.
 * This component displays that text based on the trial league and stage.
 */
const TimeSummaryExplanation: FC<TimeSummaryExplanationProps> = ({ trial }) => {
  const explanation = getExplanation(trial);

  if (!explanation) {
    return null;
  }

  return <Text style={styles.text}>{explanation}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    width: '90%',
    marginHorizontal: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
});

export default TimeSummaryExplanation;
