export const getListData = (value) => {
    let listData;
    switch (value.date()) {
      case 1:
        listData = [{ type: 'success', content: 'Attend' }];
        break;
      case 2:
        listData = [{ type: 'default', content: 'Leave' }];
        break;
      case 3:
        listData = [{ type: 'success', content: 'Attend' }];
        break;
      case 4:
        listData = [{ type: 'success', content: 'Attend' }];
        break;
      case 5:
        listData = [{ type: 'success', content: 'Attend' }];
        break;
      case 6:
        listData = [{ type: 'default', content: 'Leave' }];
        break;
      case 7:
        listData = [{ type: 'success', content: 'Attend' }];
        break;
      case 8:
        listData = [{ type: 'success', content: 'Attend' }];
        break;
      case 9:
        listData = [{ type: 'error', content: 'Absent' }];
        break;
      case 10:
        listData = [{ type: 'error', content: 'Absent' }];
        break;
      case 11:
        listData = [{ type: 'success', content: 'Attend' }];
        break;
      case 12:
        listData = [{ type: 'default', content: 'Leave' }];
        break;
      case 13:
        listData = [{ type: 'success', content: 'Attend' }];
        break;
      case 14:
        listData = [{ type: 'default', content: 'Leave' }];
        break;
      case 15:
        listData = [{ type: 'error', content: 'Absent' }];
        break;
      case 16:
        listData = [{ type: 'success', content: 'Attend' }];
        break;
      case 17:
        listData = [{ type: 'default', content: 'Leave' }];
        break;
      case 18:
        listData = [{ type: 'success', content: 'Attend' }];
        break;
      case 19:
        listData = [{ type: 'error', content: 'Absent' }];
        break;
      case 20:
        listData = [{ type: 'success', content: 'Attend' }];
        break;
      case 21:
        listData = [{ type: 'success', content: 'Attend' }];
        break;
      case 22:
        listData = [{ type: 'success', content: 'Attend' }];
        break;
      case 23:
        listData = [{ type: 'default', content: 'Leave' }];
        break;
      case 24:
        listData = [{ type: 'success', content: 'Attend' }];
        break;
      case 25:
        listData = [{ type: 'error', content: 'Absent' }];
        break;
      case 26:
        listData = [{ type: 'default', content: 'Leave' }];
        break;
      case 27:
        listData = [{ type: 'success', content: 'Attend' }];
        break;
      case 28:
        listData = [{ type: 'error', content: 'Absent' }];
        break;
      case 29:
        listData = [{ type: 'success', content: 'Attend' }];
        break;
      case 30:
        listData = [{ type: 'error', content: 'Absent' }];
        break;
      default:
    }
    return listData || [];
  };
  