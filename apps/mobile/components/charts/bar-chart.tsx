import React from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

const BarChartKit = () => {

  const LINE_COLOR = '#34C759';      // Standard Green
  const START_GRADIENT = '#34C759';

  const barData = Array.from({length: 12}, (_, i) => {
    // Generate a random value between 30 and 100 for better chart visibility
    const randomValue = Math.floor(Math.random() * 70) + 30; 
    
    // Generate month label
    const date = new Date();
    date.setMonth(i);
    const monthLabel = date.toLocaleString('default', { month: 'short' });

    return {
      value: randomValue,
      label: monthLabel,
      // Apply the green theme colors to each bar
      frontColor: LINE_COLOR, 
      gradientColor: START_GRADIENT,
    };
  });

  return (
    <View style={{ overflow: 'hidden' }} >
        <BarChart
          // Data
          data={barData}

          // **Styling the Bars**
          barWidth={50}
          spacing={5}
          barBorderRadius={1}
          showGradient

          scrollToEnd
          
          // **Axis and Grid Styling**
          // height={200}
          // width={width - 80}
          // initialSpacing={20}
          // noOfSections={6}
          // yAxisOffset={0}

          hideYAxisText
          
          // Axis colors
          // xAxisColor={'#444'}
          // yAxisColor={'#444'}
          // yAxisTextStyle={{ color: 'lightgray' }}
          // xAxisLabelTextStyle={{ color: 'lightgray', width: 30 }}
          
          // Remove Y-Axis line thickness for a cleaner look
          yAxisThickness={0}
          xAxisThickness={0}
          
          // Customizing Rules (Horizontal Lines)
        //   showGridLines={true}
          // rulesThickness={0.5}
          // rulesColor={'#333'}
          hideRules
          
          // Optional: Add Animation
          isAnimated
          animationDuration={1000}
        />
    </View>
  );
};


export default BarChartKit;