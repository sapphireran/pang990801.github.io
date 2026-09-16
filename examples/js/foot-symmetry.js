(function () {
  var status = ".status";
  var names = [
    "双脚相同",
    "左脚比右脚大10-20%",
    "左脚比右脚大20%以上",
    "右脚比左脚大20%以上",
    "右脚比左脚大10-20%"
  ];

  FootExamples.loadDataset("foot-symmetry")
    .then(function (pack) {
      var frames = pack.frames;
      var time = frames.map(function (frame) {
        return frame.ageLabel;
      });
      var options = frames.map(function (frame) {
        var c = frame.categories;
        return {
          series: {
            data: [
              { name: names[0], value: c.sameBothFeet },
              { name: names[1], value: c.leftLarger10to20 },
              { name: names[2], value: c.leftLargerOver20 },
              { name: names[3], value: c.rightLargerOver20 },
              { name: names[4], value: c.rightLarger10to20 }
            ]
          }
        };
      });
      var chart = FootExamples.initChart(".chart");
      chart.setOption({
        baseOption: {
          backgroundColor: "rgba(49,32,112,0.22)",
          timeline: {
            playInterval: 2000,
            axisType: "category",
            autoPlay: true,
            symbol: "circle",
            symbolSize: 8,
            data: time,
            label: { color: "#8ecbff" },
            lineStyle: { color: "#1f79ff" },
            checkpointStyle: { color: "#3dd4ff", borderColor: "#1f79ff" }
          },
          tooltip: { textStyle: { fontSize: 16 } },
          color: ["#56c979", "#5CAFF2", "#B6A2DF", "#a96ec9", "#2DC7C9"],
          series: [
            {
              type: "pie",
              radius: ["34%", "58%"],
              center: ["50%", "46%"],
              label: { fontSize: 13 }
            }
          ]
        },
        options: options
      });
      FootExamples.bindResize(chart);
      var first = frames[0].categories.sameBothFeet;
      var last = frames[frames.length - 1].categories.sameBothFeet;
      FootExamples.setStatus(
        status,
        "Synthetic frames: “same both feet” moves from " + first + " to " + last + " as the log terms decay."
      );
    })
    .catch(function (err) {
      FootExamples.fail(status, err);
    });
})();
