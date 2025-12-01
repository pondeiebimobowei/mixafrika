import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart, lineDataItem } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');

const GreenAreaChart = () => {
  const data: lineDataItem[] = Array.from({length: 12}, (_, i) => {
  const date = new Date();
  
  date.setMonth(i);
  
  return {
    value: Math.floor(Math.random() * 100),
    label: date.toLocaleString('default', { month: 'short' }),
  };
}); 

  

  const LINE_COLOR = '#4CAF50';
  const START_GRADIENT = 'hsl(151 51% 33%)';
  const END_GRADIENT = 'hsl(151 51% 33%)';

  return (
    <View style={{ overflow: 'hidden' }} >
      <LineChart
        areaChart
        data={data}
        scrollToEnd

        showDataPointLabelOnFocus

        curved
        width={width-70}
        color={LINE_COLOR}
        thickness={1}
        hideDataPoints
        hideYAxisText
        
        startFillColor={START_GRADIENT}
        endFillColor={END_GRADIENT}
        startOpacity={1}
        endOpacity={0.4}
        initialSpacing={20}
        noOfSections={4}

        yAxisThickness={0}
        xAxisThickness={0}
        
        yAxisOffset={0}
        yAxisTextStyle={{ color: 'lightgray' }}
        
        hideRules
        
        isAnimated
        animationDuration={1200}
      />
    </View>
  );
};

export default GreenAreaChart;
