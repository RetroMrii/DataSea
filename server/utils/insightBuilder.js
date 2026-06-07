const round = (value, decimals = 2) => {
  if (value === null || value === undefined || Number.isNaN(value)) return null;

  return Number(value.toFixed(decimals));
};

const buildInsights = (analysis) => {
  const insights = [];

  insights.push(
    `The dataset contains ${analysis.rowCount} rows and ${analysis.columnCount} columns.`
  );

  if (analysis.duplicateRowCount > 0) {
    insights.push(
      `${analysis.duplicateRowCount} duplicate row${analysis.duplicateRowCount === 1 ? '' : 's'} detected.`
    );
  } else {
    insights.push('No duplicate rows were detected.');
  }

  const missingColumns = analysis.missingValues.byColumn
    .filter((column) => column.missingValues > 0)
    .sort((a, b) => b.percentage - a.percentage);

  if (missingColumns.length > 0) {
    const topMissing = missingColumns[0];

    insights.push(
      `Column "${topMissing.columnName}" has the highest missing-value rate at ${round(
        topMissing.percentage
      )}%.`
    );
  } else {
    insights.push('No missing values were detected.');
  }

  const numericStats = analysis.summaryStatistics.numeric || [];

  if (numericStats.length > 0) {
    const widestRange = [...numericStats].sort((a, b) => {
      const rangeA = (a.max ?? 0) - (a.min ?? 0);
      const rangeB = (b.max ?? 0) - (b.min ?? 0);
      return rangeB - rangeA;
    })[0];

    if (widestRange) {
      insights.push(
        `Numeric column "${widestRange.columnName}" ranges from ${round(
          widestRange.min
        )} to ${round(widestRange.max)}.`
      );
    }
  }

  if (analysis.outlierSummary.totalOutliers > 0) {
    insights.push(
      `${analysis.outlierSummary.totalOutliers} possible outlier value${
        analysis.outlierSummary.totalOutliers === 1 ? '' : 's'
      } detected using the IQR method.`
    );
  }

  const categoricalStats = analysis.summaryStatistics.categorical || [];

  if (categoricalStats.length > 0) {
    const strongestCategory = categoricalStats
      .flatMap((column) =>
        column.values.map((value) => ({
          columnName: column.columnName,
          ...value,
        }))
      )
      .sort((a, b) => b.percentage - a.percentage)[0];

    if (strongestCategory) {
      insights.push(
        `The most common category is "${strongestCategory.label}" in "${strongestCategory.columnName}", representing ${round(
          strongestCategory.percentage
        )}% of known values.`
      );
    }
  }

  return insights;
};

module.exports = {
  buildInsights,
};