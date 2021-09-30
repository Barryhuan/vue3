<style lang="less" scope>
.form-container {
  .c(rgba(0,0,0,.65));
  .el-form {
    .pd(0 16px);
    .dp(f);
    .over(h);
    ::-webkit-input-placeholder {
      .ft-s(12px);
      .c(rgb(#9e9e9e));
    }
    .el-form-item {
      .mg(b, 16px);
      .el-form-item__content {
        .dp(f);
        & > * {
          .mg(r, 12px);
        }
      }
      .input-name {
        .w(220px);
        flex: 0 0 auto;
      }
    }
  }
}
.page-pagination {
  .dp(f);
  .j-c(fe);
  .mg(t, 12px);
  .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
    .bg-c(#fff);
    .ft-w(700);
    .c(#a4a1a7);
    .bd(1px solid #e5e5e5);
    .bdr(5px);
  }
  .el-pagination.is-background .el-pager li:not(.disabled) {
    &.active,
    &:hover {
      .c(#3d6eff);
      .bg-c(#fff);
      .bd(1px solid #3d6eff);
    }
  }
}
</style>
<template>
  <div>
    <div class="form-container">
      <el-form size="small">
        <el-form-item style="width:580px;">
          <el-input
            placeholder="请输入任务名称"
            style="width:220px; flex:none"
            suffix-icon="el-icon-search"
            class="input-name"
            v-model="projectName"
          ></el-input>
          <el-select v-model="value" clearable filterable placeholder="选择城市">
            <el-option
               v-for="item in options"
              :key="item.value"
              :label="item.value"
              :value="item.value">
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      border
      :header-cell-style="{ 'background-color': '#f7f7f7' }"
      :data="pointList"
    >
      <el-table-column label="任务名称">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="地点">
        <template slot-scope="scope">{{ scope.row.location_name }}</template>
      </el-table-column>
      <el-table-column label="创建日期">
        <template slot-scope="scope">{{ scope.row.created_time }}</template>
      </el-table-column>
      <el-table-column label="状态">
        <template>完成</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="check(scope.row.id)">查看</el-button>
          <el-button size="small" type="text">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next"
        background
        :total="pointList.length">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: '',
      projectName: ''
    }
  },
  mounted() {
    // if (
    //   !this.pointList.length &&
    //   !this.cityList.length &&
    //   this.cityId === '' &&
    //   this.pointId === ''
    // ) {
      // this.changeLoadingStatus(!0)
      // this.$emit('changLoading')
    // }
  },
  methods: {
    ...mapActions(['setPointId', 'getPointList', 'changeLoadingStatus']),
    check(id) {
      this.$router.push({ path: '/home/overview', query: { id }})
      this.setPointId(id)
      this.$setItem('pointId', id)
    },
    handleSizeChange() {},
    handleCurrentChange() {}
  },
  computed: {
    ...mapGetters([
      'pointId',
      'pointList',
      'cityId',
      'cityList',
      'loadingStatus'
    ])
  },
  // watch: {
  //   async cityId(newVal) {
  //     console.log(1)
  //     this.changeLoadingStatus(!0)
  //     return newVal
  //   },
  //   pointList: {
  //     handler(val) {
  //       console.log(2)
  //       this.changeLoadingStatus(!1)
  //       return val
  //     },
  //     deep: !0
  //   }
  // }
}
</script>

