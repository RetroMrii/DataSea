const isMissingValue = (value) => {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (typeof value === 'string' && value.trim() === '')
  );
};

const normalizeString = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const parseNumber = (value) => {
  if (isMissingValue(value)) return null;

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const cleaned = String(value).replace(/,/g, '').trim();
  const number = Number(cleaned);

  return Number.isFinite(number) ? number : null;
};

const isBooleanLike = (value) => {
  if (typeof value === 'boolean') return true;

  const normalized = normalizeString(value).toLowerCase();

  return ['true', 'false', 'yes', 'no', '0', '1'].includes(normalized);
};

const isDateLike = (value) => {
  if (isMissingValue(value)) return false;

  const date = new Date(value);

  return !Number.isNaN(date.getTime()) && normalizeString(value).length >= 6;
};

const detectColumnType = (values) => {
  const presentValues = values.filter((value) => !isMissingValue(value));

  if (presentValues.length === 0) {
    return 'empty';
  }

  const numericCount = presentValues.filter((value) => parseNumber(value) !== null).length;
  const booleanCount = presentValues.filter(isBooleanLike).length;
  const dateCount = presentValues.filter(isDateLike).length;

  const total = presentValues.length;
  const threshold = 0.8;

  if (numericCount / total >= threshold) return 'number';
  if (booleanCount / total >= threshold) return 'boolean';
  if (dateCount / total >= threshold) return 'date';

  const uniqueCount = new Set(presentValues.map((value) => normalizeString(value).toLowerCase())).size;

  if (uniqueCount > total * 0.7) return 'string';

  return 'string';
};

const getAllColumns = (rows) => {
  const columnSet = new Set();

  rows.forEach((row) => {
    Object.keys(row).forEach((key) => columnSet.add(key));
  });

  return Array.from(columnSet);
};

const getColumnValues = (rows, columnName) => {
  return rows.map((row) => row[columnName]);
};

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return null;

  const sum = numbers.reduce((total, number) => total + number, 0);

  return sum / numbers.length;
};

const calculateMedian = (numbers) => {
  if (numbers.length === 0) return null;

  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
};

const calculateMode = (values) => {
  if (values.length === 0) return null;

  const counts = new Map();

  values.forEach((value) => {
    const key = normalizeString(value);
    if (!key) return;

    counts.set(key, (counts.get(key) || 0) + 1);
  });

  let mode = null;
  let maxCount = 0;

  counts.forEach((count, value) => {
    if (count > maxCount) {
      maxCount = count;
      mode = value;
    }
  });

  return mode;
};

const calculateStandardDeviation = (numbers) => {
  if (numbers.length === 0) return null;

  const average = calculateAverage(numbers);
  const squaredDifferences = numbers.map((number) => (number - average) ** 2);
  const variance = calculateAverage(squaredDifferences);

  return Math.sqrt(variance);
};

const quantile = (numbers, q) => {
  if (numbers.length === 0) return null;

  const sorted = [...numbers].sort((a, b) => a - b);
  const position = (sorted.length - 1) * q;
  const base = Math.floor(position);
  const rest = position - base;

  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }

  return sorted[base];
};

const detectOutliersIqr = (numbers) => {
  if (numbers.length < 4) {
    return {
      count: 0,
      sampleValues: [],
      method: 'iqr',
      lowerBound: null,
      upperBound: null,
    };
  }

  const q1 = quantile(numbers, 0.25);
  const q3 = quantile(numbers, 0.75);
  const iqr = q3 - q1;

  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  const outliers = numbers.filter((number) => number < lowerBound || number > upperBound);

  return {
    count: outliers.length,
    sampleValues: outliers.slice(0, 10),
    method: 'iqr',
    lowerBound,
    upperBound,
  };
};

const countDuplicateRows = (rows) => {
  const seen = new Set();
  let duplicateCount = 0;

  rows.forEach((row) => {
    const normalized = JSON.stringify(
      Object.keys(row)
        .sort()
        .reduce((acc, key) => {
          acc[key] = row[key];
          return acc;
        }, {})
    );

    if (seen.has(normalized)) {
      duplicateCount += 1;
    } else {
      seen.add(normalized);
    }
  });

  return duplicateCount;
};

const buildColumnMetadata = (rows, columns) => {
  return columns.map((columnName) => {
    const values = getColumnValues(rows, columnName);
    const missingValues = values.filter(isMissingValue).length;
    const presentValues = values.filter((value) => !isMissingValue(value));
    const uniqueValues = new Set(presentValues.map((value) => normalizeString(value))).size;

    return {
      name: columnName,
      detectedType: detectColumnType(values),
      totalValues: values.length,
      missingValues,
      uniqueValues,
      sampleValues: presentValues.slice(0, 5),
    };
  });
};

const buildNumericStatistics = (rows, columnMetadata) => {
  return columnMetadata
    .filter((column) => column.detectedType === 'number')
    .map((column) => {
      const numbers = getColumnValues(rows, column.name)
        .map(parseNumber)
        .filter((value) => value !== null);

      const outliers = detectOutliersIqr(numbers);

      return {
        columnName: column.name,
        values:numbers,
        min: numbers.length ? Math.min(...numbers) : null,
        max: numbers.length ? Math.max(...numbers) : null,
        average: calculateAverage(numbers),
        median: calculateMedian(numbers),
        mode: calculateMode(numbers),
        standardDeviation: calculateStandardDeviation(numbers),
        outliers,
      };
    });
};

const buildCategoricalStatistics = (rows, columnMetadata) => {
  return columnMetadata
    .filter((column) => ['string', 'boolean', 'date'].includes(column.detectedType))
    .map((column) => {
      const values = getColumnValues(rows, column.name)
        .filter((value) => !isMissingValue(value))
        .map((value) => normalizeString(value));

      const counts = new Map();

      values.forEach((value) => {
        counts.set(value, (counts.get(value) || 0) + 1);
      });

      const sortedValues = Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([label, count]) => ({
          label,
          count,
          percentage: values.length ? (count / values.length) * 100 : 0,
        }));

      return {
        columnName: column.name,
        values: sortedValues,
      };
    });
};

const buildMissingValueSummary = (rows, columnMetadata) => {
  const totalMissingValues = columnMetadata.reduce(
    (total, column) => total + column.missingValues,
    0
  );

  return {
    totalMissingValues,
    byColumn: columnMetadata.map((column) => ({
      columnName: column.name,
      missingValues: column.missingValues,
      percentage: rows.length ? (column.missingValues / rows.length) * 100 : 0,
    })),
  };
};

const buildOutlierSummary = (numericStats) => {
  const totalOutliers = numericStats.reduce(
    (total, stat) => total + (stat.outliers?.count || 0),
    0
  );

  return {
    totalOutliers,
    columnsWithOutliers: numericStats
      .filter((stat) => stat.outliers?.count > 0)
      .map((stat) => stat.columnName),
  };
};

const buildTablePreview = (rows, columns, maxRowsShown = 20) => {
  return {
    columns,
    rows: rows.slice(0, maxRowsShown).map((row) => columns.map((column) => row[column] ?? '')),
    maxRowsShown,
  };
};

const analyzeRows = (rows) => {
  if (!Array.isArray(rows)) {
    const error = new Error('Rows must be an array.');
    error.statusCode = 400;
    throw error;
  }

  const columns = getAllColumns(rows);
  const columnMetadata = buildColumnMetadata(rows, columns);
  const numericStats = buildNumericStatistics(rows, columnMetadata);
  const categoricalStats = buildCategoricalStatistics(rows, columnMetadata);
  const missingValues = buildMissingValueSummary(rows, columnMetadata);
  const duplicateRowCount = countDuplicateRows(rows);
  const outlierSummary = buildOutlierSummary(numericStats);
  const tablePreview = buildTablePreview(rows, columns);

  return {
    rowCount: rows.length,
    columnCount: columns.length,
    columns: columnMetadata,
    summaryStatistics: {
      numeric: numericStats,
      categorical: categoricalStats,
    },
    missingValues,
    duplicateRowCount,
    outlierSummary,
    tablePreview,
  };
};

module.exports = {
  analyzeRows,
  parseNumber,
  isMissingValue,
};